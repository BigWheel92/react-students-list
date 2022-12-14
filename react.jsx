 class Student {
  constructor() {
    this._rollNumber = null;
    this._name = null;
    this._cgpa = null;
  }

  get rollNumber() {
    return this._rollNumber;
  }

  get name() {
    return this._name;
  }

  get cgpa() {
    return this._cgpa;
  }

  set rollNumber(rollNumber_) {
    this._rollNumber = rollNumber_;
  }

  set name(name_) {
    this._name = name_;
  }

  set cgpa(cgpa_) {
    this._cgpa = cgpa_;
  }
}

class StudentDataListComp extends React.Component {
  constructor(props) {
    super(props);

    this.state = { students: new Map() };
    this.deleteStudent = this.deleteStudent.bind(this);
    this.updateStudent = this.updateStudent.bind(this);
    this.addNewStudent = this.addNewStudent.bind(this);
    this.renderStudent = this.renderStudent.bind(this);
    this.submitNewStudentBtnHandler =
      this.submitNewStudentBtnHandler.bind(this);
  }

  deleteStudent(rollNumber) {
    let tempStudents = this.state.students;
    tempStudents.delete(rollNumber);
    this.setState({ students: tempStudents });
  }

  updateStudent(oldRollNumber, newRollNumber, newName, newCGPA) {
    let message = "";
    let tempStudents = this.state.students;

    if (
      oldRollNumber !== newRollNumber &&
      (Number.isNaN(newRollNumber) ||
        newRollNumber < 1 ||
        tempStudents.has(newRollNumber))
    )
      message += "-> Please enter a valid and unique roll number.";

    if (newName === "") message += "-> Please enter a valid name.";

    if (Number.isNaN(newCGPA) || newCGPA < 0 || newCGPA > 4)
      message += "-> Please enter a valid cgpa.";

    if (message !== "") {
      alert(message);
    } else {
      if (oldRollNumber === newRollNumber) {
        tempStudents.get(oldRollNumber).name = newName;
        tempStudents.get(oldRollNumber).cgpa = newCGPA;
      } else {
        let modifiedStudent = tempStudents.get(oldRollNumber);
        tempStudents.delete(oldRollNumber);
        modifiedStudent.rollNumber = newRollNumber;
        modifiedStudent.name = newName;
        modifiedStudent.cgpa = newCGPA;
        tempStudents.set(newRollNumber, modifiedStudent);
      }

      this.setState({ students: tempStudents });
    }
  }

  addNewStudent(rollNumber, name, cgpa) {
    tempStudents = this.state.students;
    if (tempStudents.has(rollNumber)) return;

    newStudent = new Student();
    newStudent.rollNumber = rollNumber;
    newStudent.name = name;
    newStudent.cgpa = cgpa;
    tempStudents.set(rollNumber, newStudent);
  }

  renderStudent = (student, i) => {
    return (
    <div>
      <StudentDataComp
        key={i}
        student={student}
        index={student.rollNumber}
        deleteStudent={this.deleteStudent}
        updateStudent={this.updateStudent}
      ></StudentDataComp>
      <br/>
      <br/>
    </div>
    );
  };

  submitNewStudentBtnHandler() {
    let message = "";
    let studentsList = this.state.students;

    let rollNumber = parseInt(
      document.getElementById("newRollNumberTextBox").value
    );

    if (
      studentsList.has(rollNumber) ||
      Number.isNaN(rollNumber) ||
      rollNumber < 1
    )
      message += "-> Please enter a valid and unique roll number.\n";

    let name = document.getElementById("newNameTextBox").value;

    if (name === "") message += "-> Please enter a valid name.\n";

    let cgpa = parseFloat(document.getElementById("newCGPATextBox").value);

    if (cgpa < 1 || cgpa > 4 || Number.isNaN(cgpa))
      message += "-> Please enter a valid cgpa.";

    if (message !== "") {
      alert(message);
    } else {
      let newStudent = new Student();
      newStudent.rollNumber = rollNumber;
      newStudent.name = name;
      newStudent.cgpa = cgpa;
      studentsList.set(rollNumber, newStudent);
      this.setState({ students: studentsList });
    }
  }

  render() {
    let arrayStudents = Array.from(this.state.students.values());
    return (
      <div>
        <label>Add New Student:</label>
        <input
          type="text"
          placeholder="Roll Number"
          id="newRollNumberTextBox"
          pattern="[1-9][0-9]+"
        />{" "}
        <input type="text" placeholder="Name" id="newNameTextBox" />{" "}
        <input type="text" placeholder="cgpa" id="newCGPATextBox" />
        <button onClick={this.submitNewStudentBtnHandler}>Submit</button>
        <br />
        <br />
        {arrayStudents.map(this.renderStudent)}
      </div>
    );
  }
}

class StudentDataComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { edit: 0 };
    this.updateBtnHandler = this.updateBtnHandler.bind(this);
    this.renderEdit = this.renderEdit.bind(this);
    this.renderNormal = this.renderNormal.bind(this);
    this.saveBtnHandler = this.saveBtnHandler.bind(this);
    this.deleteBtnHandler = this.deleteBtnHandler.bind(this);
    this.cancelBtnHandler = this.cancelBtnHandler.bind(this);
  }

  updateBtnHandler() {
    this.setState({ edit: 1 });
  }

  deleteBtnHandler() {
    //  alert(this.refs.rollNumberLabel.value); why is it undefined?
    this.props.deleteStudent(this.props.student.rollNumber);
  }

  saveBtnHandler() {
    this.props.updateStudent(
      parseInt(this.props.student.rollNumber),
      parseInt(this.refs.editRollNumberTextBox.value),
      this.refs.editNameTextBox.value,
      this.refs.editCgpaTextBox.value
    );
    this.setState({ edit: 0 });
  }

  cancelBtnHandler() {
    this.setState({ edit: 0 });
  }

  renderNormal() {
    return (
      <div>
        <label>RollNumber:&nbsp;</label>
        <label ref="rollNumberLabel"> {this.props.student.rollNumber} </label>
        <br />
        <label>Name:&nbsp;</label>
        <label ref="nameLabel"> {this.props.student.name} </label>
        <br />
        <label>CGPA:&nbsp;</label>
        <label ref="CGPALabel"> {this.props.student.cgpa} </label>
        <br />
        <button type="button" onClick={this.updateBtnHandler}>
          Update
        </button>{" "}
        <button type="button" onClick={this.deleteBtnHandler}>
          Delete
        </button>
      </div>
    );
  }

  renderEdit() {
    return (
      <div>
        <label>
          Roll Number:&nbsp;&nbsp;
          <input
            type="text"
            ref="editRollNumberTextBox"
            defaultValue={this.props.student.rollNumber}
          />
        </label>
        <br />
        <label>
          Name:{" "}
          <input
            type="text"
            ref="editNameTextBox"
            defaultValue={this.props.student.name}
          />{" "}
        </label>
        <br />
        <label>
          CGPA:&nbsp;&nbsp;
          <input
            type="text"
            ref="editCgpaTextBox"
            defaultValue={this.props.student.cgpa}
          />
        </label>
        <br />
        <button type="button" onClick={this.saveBtnHandler}>
          Save
        </button>
        {" "}

        <button type="button" onClick={this.cancelBtnHandler}>
          Cancel
        </button>
      </div>
    );
  }

  render() {
    if (this.state.edit) return this.renderEdit();
    else return this.renderNormal();
  }
}

ReactDOM.render(<StudentDataListComp />, document.getElementById("main"));
