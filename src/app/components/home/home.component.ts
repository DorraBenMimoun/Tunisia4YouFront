import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  ngAfterViewInit(): void {
    // Delay pour s'assurer que le DOM est bien prêt
    setTimeout(() => {
      $('.slider_active').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        nav: true,
        dots: true,
        autoplayTimeout: 5000,
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
      });
    }, 0);
  }

}
