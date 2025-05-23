export default class Student {
  static async load(id) {
    let res = await fetch(`/api/students/${id}`);
    let data = await res.json();
    return new Student(data);
  }

  constructor(data) {
    // Copy all key/values from data to this instance
    // this.id = data.id;
    // this.givenName = data.givenName;
    Object.assign(this, data);

    // Store the API endpoint for this student
    this._uri = `/api/students/${this.id}`;
  }

  // what data to send back when we convert the Student object to JSON(Ex:server updating)
  toJSON() {
    return {
      id: this.id,
      givenName: this.givenName,
      dept: this.dept
      // Add other relevant properties if needed
    };
  }
  //Class Usage — how the class is used in practice (methods like load(), listCourses(), declare())
  async listCourses() {
    let res = await fetch(`${this._uri}/courses`);
    let json = await res.json();
    return json.courses;
  }

  async declare(deptCode) {
    let body = { dept: deptCode };
    let res = await fetch(this._uri, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    let data = await res.json();
    if (res.status !== 200) {
      throw new Error(data.error);
    }
    this.dept = data.dept;
  }
}
