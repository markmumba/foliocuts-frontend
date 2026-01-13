import type { RecordResponse, ServiceItem } from "@digital-barbershop/shared-types";

export const formatRecordCurrency = (amount?: number | string) => {
    const parsed = Number(amount ?? 0);
    if (Number.isNaN(parsed)) return "KES 0.00";
    return `KES ${parsed.toFixed(2)}`;
};

export const formatRecordDateTime = (dateString?: string) => {
    if (!dateString) return { full: "—", date: "—", time: "—" };
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return { full: dateString, date: dateString, time: "—" };

    return {
        full: date.toLocaleDateString("en-KE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
        date: date.toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        time: date.toLocaleTimeString("en-KE", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};

export const buildRecordReceiptHtml = (record: RecordResponse): string => {
    const date = formatRecordDateTime(record.createdAt);

    const serviceRows = (record.serviceItems ?? [])
        .map((item: ServiceItem) => {
            const price = formatRecordCurrency(item.price);
            return `
                    <tr>
                        <td style="padding: 8px 4px; border-bottom: 1px solid #eee;">
                            ${item.serviceName}
                        </td>
                        <td style="padding: 8px 4px; border-bottom: 1px solid #eee; text-align: left;">
                            ${item.staffName}
                        </td>
                        <td style="padding: 8px 4px; border-bottom: 1px solid #eee; text-align: right;">
                            ${price}
                        </td>
                    </tr>
                `;
        })
        .join("");

    return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Receipt - ${record.recordCode}</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 0;
        padding: 24px;
        background: #f5f5f5;
        color: #111827;
      }
      .receipt-container {
        max-width: 640px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      }
      .receipt-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }
      .title {
        font-size: 20px;
        font-weight: 700;
        margin: 0;
      }
      .subtitle {
        font-size: 12px;
        color: #6b7280;
        margin: 2px 0;
      }
      .section-title {
        font-size: 13px;
        font-weight: 600;
        margin: 16px 0 8px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #6b7280;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        margin: 4px 0;
      }
      .summary-row strong {
        font-weight: 600;
      }
      .total {
        font-size: 16px;
        font-weight: 700;
        margin-top: 8px;
      }
      .footer {
        margin-top: 24px;
        font-size: 11px;
        color: #9ca3af;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="receipt-container">
      <div class="receipt-header">
        <div>
          <h1 class="title">FolioCuts Receipt</h1>
          <p class="subtitle">Record ID: ${record.recordCode}</p>
          <p class="subtitle">Date: ${date.full}</p>
        </div>
        <div style="text-align: right; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;"><strong>Status:</strong> ${record.status}</p>
          <p style="margin: 2px 0 0;"><strong>Customer:</strong> ${record.customerName || "Guest Customer"}</p>
          <p style="margin: 2px 0 0;"><strong>Phone:</strong> ${record.customerPhoneNumber || "-"}</p>
        </div>
      </div>

      <div>
        <h2 class="section-title">Services</h2>
        <table>
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px 4px; border-bottom: 1px solid #e5e7eb;">Service</th>
              <th style="text-align: left; padding: 8px 4px; border-bottom: 1px solid #e5e7eb;">Staff</th>
              <th style="text-align: right; padding: 8px 4px; border-bottom: 1px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${serviceRows || `<tr><td colspan="3" style="padding: 12px 4px; text-align: center; color: #9ca3af;">No services recorded.</td></tr>`}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 18px;">
        <h2 class="section-title">Summary</h2>
        <div class="summary-row">
          <span>Service Price</span>
          <span><strong>${formatRecordCurrency(record.totalAmount)}</strong></span>
        </div>
        <div class="summary-row">
          <span>Discount</span>
          <span><strong>-${formatRecordCurrency(record.discountAmount)}</strong></span>
        </div>
        <div class="total">
          Final Amount: ${formatRecordCurrency(record.finalAmount)}
        </div>
      </div>

      ${record.message
            ? `<div style="margin-top: 16px;">
                 <h2 class="section-title">Notes</h2>
                 <p style="font-size: 13px; color: #4b5563; line-height: 1.5;">${record.message}</p>
               </div>`
            : ""
        }

      <div class="footer">
        Thank you for choosing FolioCuts. Keep your barbershop growing with every cut.
      </div>
    </div>
  </body>
</html>
        `;
};


