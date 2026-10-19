import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Lesson } from '../data/curriculum';

interface ExportPdfParams {
  lesson: Lesson;
  studentNotes: string;
  studentName?: string;
  explanationMode: 'kichik' | 'katta' | 'both';
}

export async function exportLessonToPdf({
  lesson,
  studentNotes,
  studentName,
  explanationMode,
}: ExportPdfParams): Promise<void> {
  // Create a hidden container for PDF rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = 'serif, system-ui, -apple-system, sans-serif';
  container.style.color = '#1A2E1C';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';

  const today = new Date().toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const kichikDetails = lesson.kichik;
  const kattaDetails = lesson.katta;

  container.innerHTML = `
    <div style="border: 2px solid #2C3E2D; padding: 30px; border-radius: 16px; background-color: #FAF8F5;">
      
      <!-- PDF Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #8BA88E; padding-bottom: 20px; margin-bottom: 25px;">
        <div>
          <span style="font-size: 11px; font-weight: bold; color: #8BA88E; text-transform: uppercase; letter-spacing: 1px;">
            IT Savodxonlik Portali · Dars Konspekti
          </span>
          <h1 style="font-size: 26px; font-weight: bold; color: #1A2E1C; margin: 4px 0 0 0; font-style: italic;">
            Dars #${lesson.id}: ${lesson.title}
          </h1>
        </div>
        <div style="text-align: right;">
          <div style="background-color: #2C3E2D; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold;">
            Darslik #${lesson.id}
          </div>
          <p style="font-size: 10px; color: #828282; margin-top: 6px; font-weight: 600;">${today}</p>
        </div>
      </div>

      <!-- Overview / Description -->
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #2C3E2D; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
          📌 Darsning Umumiy Yo'nalishi
        </h3>
        <p style="font-size: 13px; color: #2D2D2D; line-height: 1.6; background-color: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #EBE7DF; margin: 0;">
          ${lesson.commonTopic}
        </p>
      </div>

      <!-- Kichik yoshdagilar uslubi -->
      ${
        explanationMode === 'kichik' || explanationMode === 'both'
          ? `
        <div style="margin-bottom: 25px; background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #EBE7DF;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; border-bottom: 1px solid #F5F5F0; padding-bottom: 8px;">
            <span style="font-size: 16px;">👦</span>
            <h3 style="font-size: 15px; font-weight: bold; color: #2C3E2D; margin: 0; font-style: italic;">
              1-4 Sinflar Uslubi (Mavzu: ${kichikDetails.topic})
            </h3>
          </div>

          <div style="margin-bottom: 12px;">
            <strong style="font-size: 11px; color: #8BA88E; text-transform: uppercase; display: block; margin-bottom: 4px;">Dars Tushunchasi:</strong>
            <p style="font-size: 12px; color: #2D2D2D; line-height: 1.5; margin: 0;">${kichikDetails.concept}</p>
          </div>

          <div style="margin-bottom: 12px; background-color: #F5F5F0; padding: 12px; border-radius: 8px; font-style: italic;">
            <strong style="font-size: 11px; color: #2C3E2D; text-transform: uppercase; display: block; margin-bottom: 4px; font-style: normal;">Sehrli Ertak va O'xshatish:</strong>
            <p style="font-size: 12px; color: #2C3E2D; line-height: 1.5; margin: 0;">"${kichikDetails.analogyOrTechDetails}"</p>
          </div>

          <div>
            <strong style="font-size: 11px; color: #8BA88E; text-transform: uppercase; display: block; margin-bottom: 6px;">Amaliy Topshiriqlar:</strong>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #2D2D2D; line-height: 1.6;">
              ${kichikDetails.practicalSteps.map((step) => `<li style="margin-bottom: 4px;">${step}</li>`).join('')}
            </ul>
          </div>
        </div>
      `
          : ''
      }

      <!-- Katta yoshdagilar uslubi -->
      ${
        explanationMode === 'katta' || explanationMode === 'both'
          ? `
        <div style="margin-bottom: 25px; background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #EBE7DF;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; border-bottom: 1px solid #F5F5F0; padding-bottom: 8px;">
            <span style="font-size: 16px;">🧑</span>
            <h3 style="font-size: 15px; font-weight: bold; color: #1A2E1C; margin: 0; font-style: italic;">
              5-9 Sinflar Uslubi (Mavzu: ${kattaDetails.topic})
            </h3>
          </div>

          <div style="margin-bottom: 12px;">
            <strong style="font-size: 11px; color: #8BA88E; text-transform: uppercase; display: block; margin-bottom: 4px;">Chuqurlashtirilgan Tushuncha:</strong>
            <p style="font-size: 12px; color: #2D2D2D; line-height: 1.5; margin: 0;">${kattaDetails.concept}</p>
          </div>

          <div style="margin-bottom: 12px; background-color: #F5F5F0; padding: 12px; border-radius: 8px;">
            <strong style="font-size: 11px; color: #2C3E2D; text-transform: uppercase; display: block; margin-bottom: 4px;">Texnik Tafsilotlar & Pro Klaviaturasi:</strong>
            <p style="font-size: 12px; color: #2D2D2D; line-height: 1.5; margin: 0;">${kattaDetails.analogyOrTechDetails}</p>
          </div>

          <div>
            <strong style="font-size: 11px; color: #8BA88E; text-transform: uppercase; display: block; margin-bottom: 6px;">Laboratoriya Ishi (Mustaqil):</strong>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #2D2D2D; line-height: 1.6;">
              ${kattaDetails.practicalSteps.map((step) => `<li style="margin-bottom: 4px;">${step}</li>`).join('')}
            </ul>
          </div>
        </div>
      `
          : ''
      }

      <!-- O'quvchining Shaxsiy Eslatmalari -->
      <div style="margin-top: 25px; border-t: 2px dashed #8BA88E; padding-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="font-size: 14px; font-weight: bold; color: #2C3E2D; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">
            📝 O'quvchining Shaxsiy Eslatmalari
          </h3>
          ${studentName ? `<span style="font-size: 11px; font-weight: bold; color: #8BA88E;">O'quvchi: ${studentName}</span>` : ''}
        </div>
        
        <div style="background-color: #ffffff; padding: 16px; border-radius: 10px; border: 1px solid #EBE7DF; min-height: 80px;">
          ${
            studentNotes && studentNotes.trim().length > 0
              ? `<p style="font-size: 12px; color: #2D2D2D; line-height: 1.6; white-space: pre-wrap; margin: 0;">${studentNotes}</p>`
              : `<p style="font-size: 12px; color: #828282; font-style: italic; margin: 0;">(Bu dars bo'yicha shaxsiy eslatma qoldirilmagan)</p>`
          }
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 30px; text-align: center; border-top: 1px solid #EBE7DF; padding-top: 15px; font-size: 10px; color: #828282;">
        <p style="margin: 0; font-weight: bold; color: #2C3E2D;">IT Savodxonlik Portali © 2026 — Yagona IT Silabusi</p>
        <p style="margin: 4px 0 0 0;">O'quvchi tomonidan avtomatik shakllantirilgan konspekt</p>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const sanitizedTitle = lesson.title.replace(/[^a-zA-Z0-9_]/g, '_');
    pdf.save(`Dars_${lesson.id}_${sanitizedTitle}_Konspekt.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  } finally {
    document.body.removeChild(container);
  }
}
