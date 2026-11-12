// The typed-out text and its speech output.

export class TextBuffer {
  constructor(onChange) {
    this.value = '';
    this.onChange = onChange;
  }

  append(s)  { this.value += s;                    this.onChange(this.value); }
  space()    { this.append(' '); }
  backspace(){ this.value = this.value.slice(0, -1); this.onChange(this.value); }
  clear()    { this.value = '';                    this.onChange(this.value); }

  speak() {
    const t = this.value.trim();
    if (!t) return;
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(t.toLowerCase()));
  }
}
