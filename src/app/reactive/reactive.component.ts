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
  subscription: Subscription = new Subscription;

  checkboxes: { name: string, value: string }[] = [
    { name: 'Bike', value: 'bike' },
    { name: "Car", value: 'car' },
    { name: "Jet", value: 'jet' }
  ];
  // In case the checkboxes have default values
  defaultValues = ['car', 'jet'];

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

  constructor(private fb: FormBuilder) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      }, 200);
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
      gender: this.fb.control('Male', [Validators.required]),
      address: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required, Validators.email], this.emailNotAllowed),
      vehicles: this.fb.array(this.checkboxes.map(x => {
        if (this.defaultValues.includes(x.value)) { return x.value }
        else { return false }
      })),
      skills: this.fb.array([
        new FormControl(null, [Validators.required]),
      ])
    }, this.groupOptions);

    this.subscription = this.checkboxFArray.valueChanges.subscribe(_checkbox => {
      this.checkboxFArray.setValue(
        this.checkboxFArray.value.map((value: any, i: number) => value ? this.checkboxes[i].value : false),
        { emitEvent: false }
      );
    });


  }
}
