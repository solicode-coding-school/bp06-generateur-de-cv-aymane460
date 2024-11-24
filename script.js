class Resume {
  constructor() {
      this.data = {};
  }

  collectData() {
      this.data = {
          image: document.getElementById('profile-image').src,
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          address: document.getElementById('address').value,
          dob: document.getElementById('dob').value,
          objective: document.getElementById('objective').value,
          education: this.getFieldValues('.education'),
          languages: this.getFieldValues('.language'),
          skills: this.getFieldValues('.skill'),
          experience: this.getFieldValues('.experience')
      };
  }

  getFieldValues(selector) {
    const values = [];
    const inputs = document.querySelectorAll(selector);
    for (let i = 0; i < inputs.length; i++) {
        values.push(inputs[i].value);
    }
    return values;
}


  generatePDF() {
      this.collectData();
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const imageSize = 50;
      if (this.data.image !== "https://via.placeholder.com/150") {
          doc.addImage(this.data.image, 'JPEG', pageWidth / 2 - imageSize / 2, 10, imageSize, imageSize);
      }

      const lines = [
          `Name: ${this.data.name}`,
          `Email: ${this.data.email}`,
          `Phone: ${this.data.phone}`,
          `Address: ${this.data.address}`,
          `Date of Birth: ${this.data.dob}`,
          `Objective: ${this.data.objective}`
      ];
      lines.forEach((line, index) => doc.text(line, 20, 70 + index * 10));

      this.addListToPDF(doc, 'Education', this.data.education, 140);
      this.addListToPDF(doc, 'Languages', this.data.languages, 170);
      this.addListToPDF(doc, 'Skills', this.data.skills, 200);
      this.addListToPDF(doc, 'Experience', this.data.experience, 230);

      doc.save('resume.pdf');
      return false;
  }

  addListToPDF(doc, title, items, startY) {
      doc.text(`${title}:`, 20, startY);
      items.forEach((item, i) => doc.text(`- ${item}`, 20, startY + 10 + i * 10));
  }
}

const resume = new Resume();

function addField(sectionId, placeholderText) {
  const section = document.getElementById(sectionId);
  const input = document.createElement('input');
  input.type = 'text';
  input.className = placeholderText.toLowerCase();
  input.placeholder = placeholderText;
  input.required = true;
  section.appendChild(input);
}

function updateImage() {
  const file = document.getElementById('image-upload').files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
          document.getElementById('profile-image').src = e.target.result;
      };
      reader.readAsDataURL(file);
  }
}
