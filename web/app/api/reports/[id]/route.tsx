import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import prisma from '@/lib/prisma';
import ReceiptTemplate from '@/components/reports/ReceiptTemplate';
import React from 'react';

import { getUserFromRequest } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // 1. Fetch Payment Details with Ownership Check
        const payment = await prisma.payment.findFirst({
            where: {
                id,
                contractorId: user.orgId // Ensure payment belongs to the user's organization
            },
            include: {
                worker: true,
            },
        });

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        const paymentData = {
            ...payment,
            amount: payment.amount.toNumber(),
        };

        // 2. Generate PDF Stream
        const stream = await renderToStream(<ReceiptTemplate payment={paymentData} />);

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
