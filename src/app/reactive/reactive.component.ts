import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormControl, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit, OnDestroy {

  reactiveForm!: FormGroup;
  checkboxSub: Subscription = new Subscription;
  statusSub: Subscription = new Subscription;
  formStatus: any;

  checkboxes: { name: string, value: string }[] = [
    { name: 'Bike', value: 'bike' },
    { name: "Car", value: 'car' },
    { name: "Jet", value: 'jet' }
  ];
  // In case the checkboxes have default values
  // defaultValues = ['car', 'jet'];

  get skillArray() {
    return this.reactiveForm.get('skills') as FormArray;
  }

  onSubmit() {
    console.log(this.reactiveForm);
  }

  addSkills() {
    (<FormArray>this.reactiveForm.get('skills')).push(new FormControl(null, [Validators.required]));
  }

  // checkboxControl = (this.reactiveForm.controls['vehicles'] as FormArray);

  get checkboxFArray() {
    return this.reactiveForm.get('vehicles') as FormArray;
  }

  addDefault() {
    this.reactiveForm.setValue({
      personalDetails: {
        firstname: 'Sachin',
        lastname: 'Varghese'
      },
      gender: 'Male',
      course: 'MBA',
      address: 'Adoor',
      email: 'abc@gmail.com',
      vehicles: [true, false, false],
      skills: ['CSS']
    })
  }

  constructor(private fb: FormBuilder) { }

  ngOnDestroy(): void {
    this.statusSub.unsubscribe();
    this.checkboxSub.unsubscribe();
  }

  noSpaceAllowed(control: FormControl) {
    if (control.value != null && control.value.includes(' ')) {
      return { noSpaceAllowed: true };
    } else {
      return null;
    }
  }

  //*Custom async validator
  emailNotAllowed(group: AbstractControl): Promise<any> | Observable<any> {
    let emailValue: string = group.get('email')?.value;
    const response = new Promise((resolve, _reject) => {
      setTimeout(() => {
        if (emailValue == 'sachin@gmail.com') {
          group.get('email')?.setErrors({ emailNotAllowed: true });
          resolve({ emailNotAllowed: true });
        }
        else {
          resolve(null);
        }
      }, 4000);
    });
    return response;
  }

  groupOptions: AbstractControlOptions = {
    validators: null,
    asyncValidators: this.emailNotAllowed
  }

  ngOnInit(): void {

    this.reactiveForm = this.fb.group({
      personalDetails: this.fb.group({
        firstname: this.fb.control(null, [Validators.required, this.noSpaceAllowed]),
        lastname: this.fb.control(null, [Validators.required, this.noSpaceAllowed]),
      }),
      course: this.fb.control(null, [Validators.required]),
      gender: this.fb.control(null, [Validators.required]),
      address: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required, Validators.email], this.emailNotAllowed),
      vehicles: this.fb.array(this.checkboxes.map(x => {
        //?------if yousing default value array----------
        // if (this.defaultValues.includes(x.value)) { return x.value }
        // else { return false }
        //?---------------------------------------------------
        return false;
      })),
      skills: this.fb.array([
        new FormControl(null, [Validators.required]),
      ])
    }, this.groupOptions);

    //? for checkbox to work properly
    this.checkboxSub = this.checkboxFArray.valueChanges.subscribe({
      next: (_checkbox) => {
        // console.log(_checkbox);
        this.checkboxFArray.setValue(
          this.checkboxFArray.value.map((value: any, i: number) => value ? this.checkboxes[i].value : false),
          { emitEvent: false });
      }
    });

    //? for learning about valueChanges and statusChanges
    // this.statusSub = this.reactiveForm.get('personalDetails.firstname')?.valueChanges.subscribe({
    //   next: (val) => {
    //     console.log(val);
    //   }
    // })
    this.statusSub = this.reactiveForm.statusChanges.subscribe({
      next: (val) => {
        this.formStatus = val;
      }
    })

  }
}
