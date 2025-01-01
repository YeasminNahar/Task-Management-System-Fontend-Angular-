import { Component } from '@angular/core';
import{jsPDF} from'jspdf';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  generatePDF(){
        const doc=new jsPDF();
        doc.text('Task Details ',10,10);
        doc.save('Task.pdf');
      }
}

