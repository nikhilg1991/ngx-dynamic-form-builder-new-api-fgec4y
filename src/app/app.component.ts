import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Expose, Type } from 'class-transformer-global-storage';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from 'class-validator-multi-lang';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { Subject } from 'rxjs';

export class PeopleAge {
  @IsNumberString()
  @IsNotEmpty()
  @Expose()
  age!: string;
}

export class Department {
  @Expose()
  id!: number;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => PeopleAge)
  @Expose()
  peopleAges!: PeopleAge[];
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  form: DynamicFormGroup<Department>;

  formBuilder = new DynamicFormBuilder();

  savedItem$ = new Subject<Department | undefined>();

  constructor() {
    this.form = this.formBuilder.rootFormGroup(
      Department,
      this.getEmptyDepartment()
    );
    console.log(this.form);
  }

  private getEmptyDepartment(): Department {
    return { peopleAges: [],} as unknown as Department;
  }

  onLoadClick(): void {
    this.form.json = this.getExampleDepartment();
    console.log(this.form);
  }

  private getExampleDepartment(): Department {
    return {
      id: 11,
      peopleAges: [{ age: '18' }],
    };
  }

  onSaveClick(): void {
    if (this.form.valid) {
      this.savedItem$.next(this.form.json);
    } else {
      this.savedItem$.next(undefined);
    }
  }

  onClearClick(): void {
    this.savedItem$.next(undefined);

    this.form.json = this.getEmptyDepartment();
    console.log(this.form);
  }

 

  //

  // peopleAges

  get peopleAges() {
    return this.form.controls['peopleAges'] as FormArray;
  }

  addPeopleAge(peopleAge: PeopleAge) {
    this.peopleAges.push(this.formBuilder.group(peopleAge));
    this.form.refresh();
    console.log(this.form);
  }

  deletePeopleAge(peopleAgeIndex: number) {
    this.peopleAges.removeAt(peopleAgeIndex);
  }
}
