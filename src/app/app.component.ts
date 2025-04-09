import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  ngOnInit() {
    setTimeout(() => {
      let loader = document.getElementById("ftco-loader");
      if (loader) {
        loader.style.display = "none";
      }
    }, 500);
}}
