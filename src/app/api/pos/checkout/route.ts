import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let totalAmount = 0;
    const descriptionParts = [];

    for (const item of items) {
      totalAmount += item.price * item.qty;
      descriptionParts.push(`${item.name} (${item.qty}x)`);
    }

    const description = `Penjualan POS: ${descriptionParts.join(', ')}`;

    const newTransaction = await prisma.transaction.create({
      data: {
        type: 'INCOME',
        amount: totalAmount,
        description: description,
      }
    });
    
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
  }
}
