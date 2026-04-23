import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    // Service role key used for powerful server operations
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseAnonKey;

    // Use service_role internally so the server can bypass RLS for admin operations if needed,
    // but typical actions should enforce logic manually or use the token provided by the user.
    // For standard users, we just use the user's JWT from headers to create a secure client.
    
    // Fallback unauthenticated client
    let supabase = createClient(supabaseUrl, supabaseServiceKey); 

    // Retrieve the authorization header
    const authHeader = req.headers.get('Authorization');
    let user = null;
    let role = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data, error } = await supabase.auth.getUser(token);
      if (data?.user) {
        user = data.user;
        // Fetch role from users table
        const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
        role = userData?.role || 'customer';
      }
    }

    const url = new URL(req.url);
    // Suppress any /api or /functions/v1/api prefix to standardize routing
    // Depending on local vs production:
    // Local: /api/products
    // Production: /functions/v1/api/products
    const rawPath = url.pathname;
    let path = rawPath;
    if (path.includes('/api/')) path = '/' + path.split('/api/')[1];
    else if (path.endsWith('/api')) path = '/';

    const method = req.method;

    // Build common json response handler
    const jsonResponse = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status
      });
    };

    const _requireRole = (allowedRoles) => {
      if (!user || (!role) || !allowedRoles.includes(role)) {
        throw new Error('Forbidden: Insufficient privileges');
      }
    };

    // --- ROUTES ---
    
    // [1] USERS /users
    if (path === '/users' && method === 'GET') {
      _requireRole(['admin']);
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw new Error(error.message);
      return jsonResponse(data);
    }
    
    // [2] UPDATE ROLE /users/:id/role
    if (path.startsWith('/users/') && path.endsWith('/role') && method === 'PUT') {
      _requireRole(['admin']);
      const id = path.split('/')[2];
      const body = await req.json();
      const { data, error } = await supabase.from('users').update({ role: body.role }).eq('id', id).select();
      if (error) throw new Error(error.message);
      return jsonResponse(data);
    }

    // [3] GET PRODUCTS /products
    if (path === '/products' && method === 'GET') {
      const { data, error } = await supabase.from('products').select('*, users(name)');
      if (error) throw new Error(error.message);
      return jsonResponse(data);
    }

    // [4] GET PRODUCT BY ID: /products/:id
    if (path.match(/^\/products\/[a-zA-Z0-9-]+$/) && method === 'GET') {
      const id = path.split('/')[2];
      const { data, error } = await supabase.from('products').select('*, users(name)').eq('id', id).single();
      if (error) throw new Error(error.message);
      return jsonResponse(data);
    }

    // [5] CREATE PRODUCT /products
    if (path === '/products' && method === 'POST') {
      _requireRole(['seller']);
      const body = await req.json();
      const newProduct = { ...body, seller_id: user.id };
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (error) throw new Error(error.message);
      return jsonResponse(data);
    }

    // [6] PLACE ORDER /orders
    if (path === '/orders' && method === 'POST') {
      _requireRole(['customer']);
      const body = await req.json();
      const { items, total_price } = body;
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{ user_id: user.id, total_price, status: 'pending' }])
        .select()
        .single();
      if (orderError) throw new Error(orderError.message);
      
      const orderItems = items.map(item => ({ ...item, order_id: orderData.id }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw new Error(itemsError.message);
      
      return jsonResponse(orderData);
    }

    // [7] GET USER ORDERS /orders/user/:id
    if (path.startsWith('/orders/user/') && method === 'GET') {
      const id = path.split('/')[3];
      if (!user || (user.id !== id && role !== 'admin')) throw new Error('Forbidden');
      
      const { data, error } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('user_id', id).order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return jsonResponse(data);
    }
    
    // [8] GET SELLER ORDERS /orders/seller/:id
    if (path.startsWith('/orders/seller/') && method === 'GET') {
      _requireRole(['seller']);
      const id = path.split('/')[3];
      if (user.id !== id) throw new Error('Forbidden');
      
      const { data, error } = await supabase
        .from('order_items')
        .select('*, orders(*), products(*)')
        .eq('seller_id', user.id);
        
      if (error) throw new Error(error.message);
      return jsonResponse(data);
    }

    // [9] GET ALL ORDERS /orders
    if (path === '/orders' && method === 'GET') {
      _requireRole(['admin']);
      const { data, error } = await supabase.from('orders').select('*, users(name, email)');
      if (error) throw new Error(error.message);
      return jsonResponse(data);
    }

    // [10] UPDATE ORDER STATUS /orders/:id/status
    if (path.startsWith('/orders/') && path.endsWith('/status') && method === 'PUT') {
      _requireRole(['seller', 'admin']);
      const id = path.split('/')[2];
      const body = await req.json();
      const { data, error } = await supabase.from('orders').update({ status: body.status }).eq('id', id).select();
      if (error) throw new Error(error.message);
      return jsonResponse(data);
    }

    // 404
    return new Response(JSON.stringify({ error: `Not Found: ${path}` }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
