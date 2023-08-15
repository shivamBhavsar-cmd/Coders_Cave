function convertPdfToWord() {
    let file = document.getElementById("pdfFile");
    if (file.files.length != 0) {
      document.getElementById("upload-txt").style.left = "120%";
      document.getElementById("done-txt").style.left = "50%";
      setTimeout(() => {
        document.getElementById("upload-txt").style.left = "50%";
        document.getElementById("done-txt").style.left = "-20%";
        document.getElementById('pdfFile').value = '';
      }, 2500);
      Conversion();
    } else {
      alert("You have not chosen any file.");
    }
  }
  
  function Conversion() {
    const fileInput = document.getElementById("pdfFile");
    const file = fileInput.files[0];
  
    const fileReader = new FileReader();
  
    fileReader.onload = function () {
      const typedarray = new Uint8Array(this.result);
      const loadingTask = pdfjsLib.getDocument(typedarray);
  
      loadingTask.promise.then(function (pdf) {
        const totalPages = pdf.numPages;
        const wordDocument = [];
  
        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          pdf.getPage(pageNumber).then(function (page) {
            page.getTextContent().then(function (textContent) {
              const textItems = textContent.items;
  
              for (let i = 0; i < textItems.length; i++) {
                wordDocument.push(textItems[i].str);
              }
  
              if (pageNumber === totalPages) {
                const wordContent = wordDocument.join(" ");
                const blob = new Blob([wordContent], {
                  type: "application/msword",
                });
                const downloadLink = document.getElementById("downloadLink");
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = "converted_word_file.doc";
                downloadLink.click();
              }
            });
          });
        }
      });
    };
    fileReader.readAsArrayBuffer(file);
  }