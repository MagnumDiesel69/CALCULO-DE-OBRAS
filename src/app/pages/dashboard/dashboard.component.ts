import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  estimacionForm!: FormGroup;
  resultado: { total: number; tiempo: number; unidad: string; nota?: string } | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.estimacionForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      tipoProyecto: ['', Validators.required],
      unidad: ['ft', Validators.required],
      area: [null, [Validators.required, Validators.min(1)]],
      acabado: ['', Validators.required],
      ubicacion: ['', Validators.required],
      detallesTrabajo: [''],
      observaciones: [''],
      tareas: this.fb.group({
        electricidad: [false],
        plomeria: [false],
        pintura: [false],
        albanileria: [false],
        carpinteria: [false],
        otros: ['']
      })
    });
  }

  calcular(): void {
    if (this.estimacionForm.valid) {
      const { area, unidad, acabado, tipoProyecto, tareas } = this.estimacionForm.value;

      // Convertir a pies si el usuario eligió metros
      const areaEnPies = unidad === 'm' ? area * 10.7639 : area;

      // Costo base por pie²
      let costoPorPie = 0;
      switch (acabado) {
        case 'basico':
          costoPorPie = 60;
          break;
        case 'medio':
          costoPorPie = 90;
          break;
        case 'premium':
          costoPorPie = 120;
          break;
      }

      // Productividad según tipo de proyecto
      const productividad = tipoProyecto === 'nueva' ? 100 : 200;

      let costoBase = areaEnPies * costoPorPie;
      const tiempo = Math.ceil(areaEnPies / productividad);

      // Sumar costo adicional por cada tarea marcada (excepto "otros")
      const tareasSeleccionadas = Object.entries(tareas).filter(
        ([key, value]) => key !== 'otros' && value === true
      );

      const costoPorTarea = 150;
      const costoExtra = tareasSeleccionadas.length * costoPorTarea;

      const total = costoBase + costoExtra;

      let nota: string | undefined;
      if (tiempo > 90) {
        nota = 'Tiempo estimado aproximado. Proyecto de gran escala.';
      }

      this.resultado = {
        total,
        tiempo,
        unidad: unidad === 'm' ? 'metros cuadrados' : 'pies cuadrados',
        nota
      };
    } else {
      this.estimacionForm.markAllAsTouched();
    }
  }

  formControlInvalido(campo: string): boolean {
    const control = this.estimacionForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  descargarPDF(): void {
    const resumen = document.getElementById('resumen-estimado');
    if (!resumen) return;

    html2canvas(resumen as HTMLElement).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resumen-estimacion.pdf');
    });
  }
}
