// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-file-attach',
//   templateUrl: './file-attach.component.html',
//   styleUrls: ['./file-attach.component.css']
// })
// export class FileAttachComponent {
//   attachedFiles: { name: string; size: number }[] = []; // List to store file info

//   // Method to handle file selection
//   onFileSelected(event: any) {
//     const files: FileList = event.target.files;
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       this.attachedFiles.push({ name: file.name, size: file.size });
//     }
//   }

//   // Method to remove a file from the list
//   removeFile(index: number) {
//     this.attachedFiles.splice(index, 1);
//   }
// }
import { Component } from '@angular/core';

@Component({
  selector: 'app-file-attach',
  templateUrl: './file-attach.component.html',
  styleUrls: ['./file-attach.component.css']
})
export class FileAttachComponent {
  taskList = [
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' },
    { id: 3, name: 'Task 3' },
  ]; // Dropdown options for tasks

  selectedTask: number | null = null; // Selected task ID

  attachedFiles: { name: string; size: number; taskName: string }[] = []; // File list

  // Method to handle file selection
  onFileSelected(event: any) {
    if (!this.selectedTask) {
      alert('Please select a task first.');
      return;
    }

    const files: FileList = event.target.files;
    const selectedTaskName = this.taskList.find(task => task.id === this.selectedTask)?.name || 'New Task';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.attachedFiles.push({
        name: file.name,
        size: file.size,
        taskName: selectedTaskName,
      });
    }
  }

  // Method to remove a file from the list
  removeFile(index: number) {
    this.attachedFiles.splice(index, 1);
  }
}
