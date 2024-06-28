import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InformeModel } from '../../../../models/informe';
import { InformeService } from '../../../../services/informe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../../../services/token.service';
// Para Imprimir en PDF
import  { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { NuevoUsuario } from '../../../../models/nuevo-usuario';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-view',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './informe-view.component.html',
  styleUrl: './informe-view.component.css'
})
export class InformeViewComponent implements OnInit {

  info: InformeModel | null = null;
  isAdmin: boolean = true;

  usuariosList: NuevoUsuario[] = [];

  @ViewChild('content') content!: ElementRef;

  constructor(
    private informeService: InformeService,
    private activatedRoute: ActivatedRoute,
    private usuarioService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.tokenService.isAdmin() ?? false;
    const id = this.activatedRoute.snapshot.params["id_informe"];
    this.informeService.detail(id).subscribe(
      (data: InformeModel) => {
        this.info = data;
      },
      (err) => {
        this.toastr.error(err.error.message, 'Fail', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        this.volver();
      }
    )
  }

  cargarUsuarios(){
    this.usuarioService.lista().subscribe(
      (data: NuevoUsuario[]) => {
        this.usuariosList = data;
      },
      (err) => {
        this.toastr.error(err.error.message, 'Fail', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      }
    )
  }

  public downloadPDF1(): void {
    const estudiante = this.info?.estudiante;
    const DATA = this.content.nativeElement;
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres descargar el informe en formato PDF?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, descargar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        html2canvas(DATA).then(canvas => {
          const fileWidth = 190;
          const fileHeight = canvas.height * fileWidth / canvas.width;

          const FILEURI = canvas.toDataURL('image/png');
          const PDF = new jsPDF('p', 'mm', 'a4');
          const position = 10;
          const leftMargin = 10;
          PDF.addImage(FILEURI, 'PNG', leftMargin, position, fileWidth, fileHeight)

          PDF.save(`informe_${estudiante}.pdf`);
        }).catch(error => {
          console.error('Error al generar el PDF:', error);
        });
      }
    });
  }


  volver(): void {
    this.router.navigate(['/dashboard/informe']);
  }
}
