import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import prisma from '@/lib/prisma';
import ReceiptTemplate from '@/components/reports/ReceiptTemplate';
import React from 'react';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+
) {
    try {
        const { id } = await params;

        // 1. Fetch Payment Details
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                worker: true,
            },
        });

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // 2. Generate PDF Stream
        const stream = await renderToStream(<ReceiptTemplate payment={payment} />);

        // 3. Return as PDF
        return new NextResponse(stream as unknown as BodyInit, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="receipt-${payment.id.slice(0, 8)}.pdf"`,
            },
        });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}
