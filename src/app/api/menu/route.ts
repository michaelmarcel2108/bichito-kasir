import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, cost } = body;
    
    if (!name || !price || !cost) {
      return NextResponse.json({ error: 'Name, price, and cost are required' }, { status: 400 });
    }

    const newMenuItem = await prisma.menuItem.create({
      data: {
        name,
        category: category || 'FOOD',
        price: parseFloat(price),
        cost: parseFloat(cost),
      }
    });
    
    return NextResponse.json(newMenuItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}
