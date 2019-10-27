import { Component, OnInit, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {
  title = 'Angular Laravel CRUD App';

  private productForm: FormGroup;
  product: any;
  products: any;
  updateBtn = false;

  constructor(private http: HttpClient) {
    this.getProducts();
  }

  ngOnInit() {
    this.productForm = new FormGroup({
        'sku': new FormControl(),
        'name': new FormControl(),
        'price': new FormControl(),
        'quantity': new FormControl()
    });
  }

  // Add a New Product
  storeProduct(productForm: NgForm) {
    // console.log('Form successful submit.');
    // console.log(productForm.value);

    this.http.post('http://127.0.0.1:8000/api/product', productForm.value).subscribe(res => {
        this.getProducts();
        productForm.reset();
        this.updateBtn = false;
    }, err => {
        console.log('Error occured');
    });
  }

  getProducts() {
    // console.log('Get Products and Update Table');
    return this.http.get('http://127.0.0.1:8000/api/products').subscribe(products => {
        this.products = products;
    });
  }

  showProduct(id) {
    console.log('Get Product ' + id);
    this.updateBtn = true;
    return this.http.get('http://127.0.0.1:8000/api/product/' + id).subscribe(product => {
        this.product = product;
        this.productForm.patchValue({ 
            id: this.product.id,
            sku: this.product.sku,
            name: this.product.name,
            price: this.product.price,
            quantity: this.product.quantity
        });
    });
  }

  deleteProduct(id) {
    console.log('Delete Product id ' + id);

    this.http.delete('http://127.0.0.1:8000/api/product/' + id).subscribe(res => {
        console.log('Product Deleted and refresh Table');
        this.getProducts();
        this.productForm.reset();
        this.updateBtn = false;
    }, err => {
        console.log('Error occured');
    });
  }

  putProduct(id) {
    console.log('Update Product id ' + id);
    this.http.put('http://127.0.0.1:8000/api/product/' + id, this.productForm.value).subscribe(res => {
        console.log('Product Updated and refresh table');
        this.getProducts();
    }, err => {
        console.log('Error occured');
    });
  }
}
