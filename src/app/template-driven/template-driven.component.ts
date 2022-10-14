import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-driven',
  templateUrl: './template-driven.component.html',
  styleUrls: ['./template-driven.component.css']
})
export class TemplateDrivenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('myForm')
  form!: NgForm;

  studentName!: string;
  studentAddress!: string;
  gender!: string;
  studentDepartment!: string;
  studentYear!: string;
  posts: boolean[] = [];

  onSubmit() {
    this.studentName = this.form.value.studentDetails.sname;
    this.studentDepartment = this.form.value.studentDetails.saddress;
    this.gender = this.form.value.sgender;
    this.studentDepartment = this.form.value.sdept;
    this.studentYear = this.form.value.syear;
  }



  studentGender = [
    { id: '1', value: 'Male' },
    { id: '2', value: 'Female' },
    { id: '3', value: 'Others' }
  ];

  studentPost = [
    { value: 'Event manager', default: true },
    { value: 'Joint event manager', default: false },
    { value: 'Sports secretary', default: true },
    { value: 'Discpline Committee', default: false }
  ];

  defaultGender = 'Male';
  defaultDepartment = 'Computer';
  defaultPost = [true, true, false, false]

  setDefault() {
    // this.form.value.studentDetails.sname = 'Robin';
    // this.form.value.studentDetails.saddress = 'robin@gmail.com';


    //? setValue() ---> used to update the whole 
    // this.form.setValue({
    //   studentDetails: {
    //     saddress: 'robin@gmail.com',
    //     sname: 'Robin'
    //   },
    //   syear: '4',
    //   sdept: "Computer",
    //   sgender: "Female",
    //   spost1: false,
    //   spost2: true,
    //   spost3: false,
    //   spost4: true
    // });


    //? patchValue() ---> used to update partially
    this.form.form.patchValue({
      studentDetails: {
        saddress: 'robin@gmail.com',
        // sname: 'Robin'
      },
      syear: '4',
      sdept: "Computer",
      // sgender: "Female",
      // spost1: false,
      // spost2: true,
      spost3: false,
      spost4: true
    })

    this.defaultGender = this.form.value.sgender;
    console.log(this.form);
  }

  reset() {
    this.form.reset();
  }

}
