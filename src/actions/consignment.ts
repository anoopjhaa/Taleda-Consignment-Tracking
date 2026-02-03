'use server';

import { supabase } from '@/lib/supabase';
import { geocode, getRouteDistance } from '@/lib/geo';
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';

export async function createConsignment(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const tracking_number = formData.get('tracking_number') as string;
  const sender_city = formData.get('sender_city') as string;
  const receiver_city = formData.get('receiver_city') as string;
  const status = formData.get('status') as string || 'Booked';
  const eta_input = formData.get('eta') as string; // Days or Date
  const dispatch_input = formData.get('dispatch_date') as string; // Date

  if (!tracking_number || !sender_city || !receiver_city || !eta_input) {
    return { error: 'Missing required fields' };
  }

  // Geocode
  const sender_coords = await geocode(sender_city);
  const receiver_coords = await geocode(receiver_city);

  if (!sender_coords || !receiver_coords) {
    return { error: 'Could not locate one or both cities. Please check spelling.' };
  }

  // Calculate Distance
  const distance_km = await getRouteDistance(sender_coords, receiver_coords);

  // Normalize Dates
  const now = new Date();
  let dispatch_date = now;
  if (dispatch_input) {
    dispatch_date = new Date(dispatch_input);
  }

  let eta_date = new Date();
  if (eta_input.includes('-')) {
    eta_date = new Date(eta_input);
  } else {
    const days = parseInt(eta_input);
    if (!isNaN(days)) {
      eta_date = new Date(dispatch_date.getTime() + days * 24 * 60 * 60 * 1000);
    }
  }

  const { error } = await supabase
    .from('consignments')
    .insert({
      tracking_number,
      sender_city,
      receiver_city,
      sender_coords: JSON.stringify(sender_coords),
      receiver_coords: JSON.stringify(receiver_coords),
      status,
      eta_date: eta_date.toISOString(),
      dispatch_date: dispatch_date.toISOString(),
      distance_km
    });

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { error: 'Tracking number already exists' };
    }
    console.error('Supabase Error:', error);
    return { error: 'Database error' };
  }

  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function updateConsignment(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const id = formData.get('id') as string;
  const tracking_number = formData.get('tracking_number') as string;
  const sender_city = formData.get('sender_city') as string;
  const receiver_city = formData.get('receiver_city') as string;
  const status = formData.get('status') as string;
  const eta_input = formData.get('eta') as string;
  const dispatch_input = formData.get('dispatch_date') as string;

  if (!id) return { error: 'Missing ID' };

  // Re-geocode
  const sender_coords = await geocode(sender_city);
  const receiver_coords = await geocode(receiver_city);
  
  if (!sender_coords || !receiver_coords) return { error: 'Invalid cities' };
  
  const distance_km = await getRouteDistance(sender_coords, receiver_coords);

  // Date Logic
  let dispatch_date = new Date();
  if (dispatch_input) dispatch_date = new Date(dispatch_input);
  
  let eta_date = new Date();
  if (eta_input.includes('-')) {
      eta_date = new Date(eta_input);
  } else {
      const days = parseInt(eta_input);
      if (!isNaN(days)) eta_date = new Date(dispatch_date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  const { error } = await supabase
    .from('consignments')
    .update({
      tracking_number,
      sender_city,
      receiver_city,
      sender_coords: JSON.stringify(sender_coords),
      receiver_coords: JSON.stringify(receiver_coords),
      status,
      eta_date: eta_date.toISOString(),
      dispatch_date: dispatch_date.toISOString(),
      distance_km
    })
    .eq('id', id);

  if (error) {
      console.error(error);
      return { error: 'Update failed' };
  }
  
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteConsignment(id: number) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('consignments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return { error: 'Failed to delete consignment' };
  }

  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function updateConsignmentStatus(id: number, status: string) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('consignments')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error(error);
    return { error: 'Update failed' };
  }

  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function getAllConsignments() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  
  const { data } = await supabase
    .from('consignments')
    .select('*')
    .order('created_at', { ascending: false });
    
  return data || [];
}

export async function getConsignmentById(id: number) {
  const session = await getSession();
  if (!session) return null;
  
  const { data } = await supabase
    .from('consignments')
    .select('*')
    .eq('id', id)
    .single();
    
  return data;
}

export async function getConsignment(tracking_number: string) {
  const { data } = await supabase
    .from('consignments')
    .select('*')
    .eq('tracking_number', tracking_number)
    .single();
    
  return data;
}
