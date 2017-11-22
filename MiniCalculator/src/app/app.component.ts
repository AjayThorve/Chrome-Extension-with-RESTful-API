import { Component } from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import Stack from 'ts-data.stack';
import {HostListener} from '@angular/core';
declare var Materialize:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value = '0';
  result = '0';
  stack;


  private url = 'https://calcapiajaythorve.herokuapp.com/calculate';

  constructor(private http: Http){
    this.stack = new Stack<string>();
  }
  isNum(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  val(temp_val) {

      if(temp_val === '('){
        this.stack.push('(');
      }else if(temp_val === ')'){
        if(this.stack.isEmpty()){
          Materialize.toast('Imbalanced paranthesis', 2000);
          return;
        }else{
          this.stack.pop();
          this.value = this.value + '' + temp_val;
          this.calc();
          return;
        }
      }
      let regex=new RegExp("[+-//*]");
      const last_char = this.value.charAt(this.value.length-1);

    if(temp_val=='/' && regex.test(last_char)){
        Materialize.toast('Invalid entry', 2000);
        return;
      }
      if(temp_val=='+' && regex.test(last_char)){
        Materialize.toast('Invalid entry', 2000);
        return;
      }
      if(temp_val=='-' && regex.test(last_char)){
        Materialize.toast('Invalid entry', 2000);
        return;
      }
      if(temp_val=='*' && regex.test(last_char)){
        Materialize.toast('Invalid entry', 2000);
        return;
      }
      if (this.value === '0') {
        if(temp_val.toString().indexOf('^')>=0){
          this.result = 'enter a value to raise to';
        }
        else if (temp_val === '.') {
          this.value = this.value + temp_val;
        }
        else {
          this.value = temp_val;
        }
      } else {
        this.value = this.value + '' + temp_val;
      }

      if ((this.isNum(temp_val) || this.value.toString().substr(this.value.length-2,2)==='^2') && this.isBalancedParanthesis()) {
        this.calc();
      }
  }

  @HostListener('window:keydown', ['$event'])keyboardInput(event: KeyboardEvent) {

    const temp_val = event.key;
    //console.log(temp_val);
    if(this.isNum(temp_val) || temp_val=='('
      || temp_val==')' || temp_val=='+' || temp_val=='-'
      || temp_val=='/' || temp_val=='*' || temp_val=='^' || temp_val == '.'){
      this.val(temp_val);
    }else if(temp_val == 'Enter'){
      this.calc();
    }else if(temp_val == "Backspace"){
      this.clearone();
    }else if(temp_val == " "){
      return;
    }
  }

  isBalancedParanthesis(){
    return this.stack.isEmpty();
  }
  change_sign(){
    if(this.value.toString().substr(0,1) === '-'){
      this.value = this.value.substring(1);
    }else if(this.value === '0'){

    }else{
      this.value = '-'+ this.value;
    }
    this.calc();
  }
  calc(){
    if(this.value==='0'){
      this.result='0';
    }else{
      let l = '?calc_string='+encodeURIComponent(this.value);

      this.http.get(this.url + l)
        .map(res => res.json())
        .subscribe(data => {
          if(this.value === '0'){
            this.clear();
          }else{
            this.result = data;
          }
          console.log(data);
        }, error2 => {
          this.result='NaN';
        });
    }

  }
  clear(){
    this.value = '0';
    this.result = '0';
  }

  round(){
    let l = '/round?calc_string='+encodeURIComponent(this.result);
    this.http.get(this.url+ l)
      .map(res => res.json())
      .subscribe(data => {
        if(this.value === '0'){
          this.clear();
        }else{
          this.result = data;
          this.value = data;
        }
      });
  }

  sqrt(){
    let l = '/sqrt?calc_string='+encodeURIComponent(this.value);
    this.http.get(this.url+ l)
      .map(res => res.json())
      .subscribe(data => {
        if(this.value === '0'){
          this.clear();
        }else{
          this.result = data;
        }
      });
  }

  log(base){
    let l = '/log'+base+'?calc_string='+encodeURIComponent(this.value);
    this.http.get(this.url+ l)
      .map(res => res.json())
      .subscribe(data => {
        if(this.value === '0'){
          this.clear();
        }else{
          this.result = data;
        }
      });
  }

  clearone(){
    if(this.value.length>1 && this.value!='0'){
      this.value = this.value.substring(0,this.value.length-1);
      this.calc();
    }else if(this.value.length==1 && this.value!='0'){
      this.value = '0';
      this.calc();
    }
  }


}
