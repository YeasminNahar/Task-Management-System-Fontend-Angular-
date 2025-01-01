import { Component } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  tasks = [
    {
      id: 'T12345',
      name: 'Develop PDF Export Feature',
      assignedTo: 'Yeasmin',
      status: 'In Progress',
      startDate: '2025-01-01',
      endDate: '2025-01-07'
    },
    {
      id: 'T12346',
      name: 'Build Dashboard UI',
      assignedTo: 'Jaber',
      status: 'Completed',
      startDate: '2024-12-15',
      endDate: '2024-12-25'
    }
  ];

  generatePDF() {
    const doc = new jsPDF();

    // Title Section
    doc.setFontSize(18);
    doc.setTextColor(40, 78, 120); // Dark blue
    doc.text('Task Detail Report', 105, 20, { align: 'center' });

    // Table Header
    doc.setFontSize(12);
    doc.setFillColor(230, 230, 250); // Light purple background
    doc.rect(10, 30, 190, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Task ID', 12, 37);
    doc.text('Task Name', 42, 37);
    doc.text('Assigned To', 102, 37);
    doc.text('Status', 142, 37);
    doc.text('Start Date', 162, 37);
    doc.text('End Date', 182, 37);

    // Task Details
    let yPosition = 47;
    this.tasks.forEach((task) => {
      doc.setFontSize(10);

      // Draw a row
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(10, yPosition - 7, 190, 10, 'F');

      doc.text(task.id, 12, yPosition);
      doc.text(task.name, 42, yPosition);
      doc.text(task.assignedTo, 102, yPosition);
      doc.text(task.status, 142, yPosition);
      doc.text(task.startDate, 162, yPosition);
      doc.text(task.endDate, 182, yPosition);

      yPosition += 10; // Move to the next row
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray text
    doc.text('Generated on: 2025-01-01', 10, 280);
    doc.text('© Task Management System', 160, 280);

    // Save the PDF
    doc.save('Styled_Task_Detail_Report.pdf');
  }
}
