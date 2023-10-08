const express = require('express') // loads the express package
const { engine } = require('express-handlebars') // loads handlebars for Express
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser')
const session = require('express-session')
const connectSqlite3 = require('connect-sqlite3')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt

const port = 8080 // defines the port
const app = express() // creates the Express application

app.use(express.static('public'))

const db = new sqlite3.Database('projects-nje.db') //Model (Data)


const SQliteStore = connectSqlite3(session);


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(session({
  store: new SQliteStore({ db: "session-db.db" }),
  "saveUninitialized": false,
  "resave": false,
  "secret": "This123Is@Another#456GreatSecret678%Sentence"
}));


// Create the users table if it doesn't exist
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user')", (error) => {
  if (error) {
    console.log("ERROR: ", error);
  } else {
    console.log('Users table created successfully.');

    const users = [
      { "username": "Yuji", "password_hash": "itadori", "role": "admin" },
      { "username": "Toji", "password_hash": "itadori", "role": "user" },
      { "username": "Nasir", "password_hash": "jama elmi", "role": "user" },
      { "username": "Hero", "password_hash": "Batman", "role": "user" },
      { "username": "Best-Teacher", "password_hash": "Jerome", "role": "admin" }
    ];

    users.forEach((user) => {
      // Hash the password using bcrypt
      bcrypt.hash(user.password_hash, saltRounds, (hashError, hash) => {
        if (hashError) {
          console.log("Hashing Error: ", hashError);
        } else {
          // Insert the user with the hashed password and role into the "users" table
          db.run("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", [user.username, hash, user.role], (insertError) => {
            if (insertError) {
              console.log("INSERT ERROR: ", insertError);
            } else {
              console.log("User added to the users table!");
            }
          });
        }
      });
    });
  }
});

// creates table education at startup
db.run("CREATE TABLE IF NOT EXISTS education (eid INTEGER PRIMARY KEY, ename TEXT NOT NULL, eyear INTEGER NOT NULL, edesc TEXT NOT NULL, etype TEXT NOT NULL, eimgURL TEXT NOT NULL)", (error) => {
  if (error) {
    // tests error: display error
    console.log("ERROR: ", error);
  } else {
    // tests error: no error, the table has been created
    console.log("---> Table education created!");

    const educationData = [
      {
        "id": "1", "name": "Introduction to Computer Science", "type": "lecture", "desc": "An introductory course covering fundamental concepts in computer science.", "year": 2022, "url": "/img/Yujit-itadori.jpg"
      },
      {
        "id": "2", "name": "Advanced Machine Learning", "type": "course", "desc": "In-depth exploration of advanced machine learning techniques and algorithms.", "year": 2021, "url": "/img/Yujit-itadori.jpg"
      },
      {
        "id": "3", "name": "Web Development Basics", "type": "workshop", "desc": "Hands-on workshop teaching the basics of web development using HTML, CSS, and JavaScript.", "year": 2020, "url": "/img/Yujit-itadori.jpg"
      },
      {
        "id": "4", "name": "Database Management Systems", "type": "course", "desc": "Study of database management systems and their applications in modern software development.", "year": 2019, "url": "/img/Yujit-itadori.jpg"
      },
      {
        "id": "5", "name": "Software Engineering Principles", "type": "lecture", "desc": "Exploration of software engineering principles, methodologies, and best practices.", "year": 2018, "url": "/img/Yujit-itadori.jpg"
      }
    ];

    // inserts education data
    educationData.forEach((oneEducation) => {
      db.run("INSERT INTO education (eid, ename, eyear, edesc, etype, eimgURL) VALUES (?, ?, ?, ?, ?, ?)", [oneEducation.id, oneEducation.name,
      oneEducation.year, oneEducation.desc, oneEducation.type, oneEducation.url], (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Line added into the education table!");
        }
      });
    });
  }
});


// creates table projects at startup
db.run("CREATE TABLE projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL, ptype TEXT NOT NULL, pimgURL TEXT NOT NULL)", (error) => {
  if (error) {
    // tests error: display error
    console.log("ERROR: ", error)
  } else {
    // tests error: no error, the table has been created
    console.log("---> Table projects created!")
    const projects = [
      {
        "id": "1", "name": "Counting people with a camera", "type": "research", "desc": "The purpose of this project is to count people passing through a corridor and to know how many are in the room at a certain time.", "year": 2022, "dev": "Python and OpenCV (Computer vision) library",
        "url": "/img/counting.png"
      },
      {
        "id": "2", "name": "Visualisation of 3D medical images", "type": "research", "desc": "The project makes a 3D model of the analysis of the body of a person and displays the detected health problems. It is useful for doctors to view in 3D their patients and the evolution of a disease.", "year":
          2012, "url": "/img/medical.png"
      },
      { "id": "3", "name": "Multiple questions system", "type": "teaching", "desc": "During the lockdowns in France, this project was useful to test the students online with a Quizz system.", "year": 2021, "url": "/img/qcm07.png" },
      {
        "id": "4", "name": "Image comparison with the Local Dissmilarity Map", "desc": "The project is about finding and quantifying the differences between two images of the same size. The applications were numerous: satallite imaging, medical imaging,...", "year": 2020, "type": "research",
        "url": "/img/diaw02.png"
      },
      { "id": "5", "name": "Management system for students' internships", "desc": "This project was about the creation of a database to manage the students' internships.", "year": 2012, "type": "teaching", "url": "/img/management.png" }
    ]
    // inserts projects
    projects.forEach((oneProject) => {
      db.run("INSERT INTO projects (pid, pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?, ?)", [oneProject.id, oneProject.name,
      oneProject.year, oneProject.desc, oneProject.type, oneProject.url], (error) => {
        if (error) {
          console.log("ERROR: ", error)
        } else {
          console.log("Line added into the projects table!")
        }
      })
    })
  }
});




// creates skills projects at startup
db.run("CREATE TABLE skills (sid INTEGER PRIMARY KEY, sname TEXT NOT NULL, sdesc TEXT NOT NULL, stype TEXT NOT NULL)", (error) => {
  if (error) {
    // tests error: display error
    console.log("ERROR: ", error)
  } else {
    // tests error: no error, the table has been created
    console.log("---> Table skills created!")
    const skills = [
      { "id": "1", "name": "PHP", "type": "Programming language", "desc": "Programming with PHP on the server side." },
      { "id": "2", "name": "Python", "type": "Programming language", "desc": "Programming with Python." },
      { "id": "3", "name": "Java", "type": "Programming language", "desc": "Programming with Java." },
      { "id": "4", "name": "ImageJ", "type": "Framework", "desc": "Java Framework for Image Processing." },
      { "id": "5", "name": "Javascript", "type": "Programming language", "desc": "Programming with Javascript on the client side." },
      { "id": "6", "name": "Node", "type": "Programming language", "desc": "Programming with Javascript on the server side." },
      { "id": "7", "name": "Express", "type": "Framework", "desc": "A framework for programming Javascript on the server side." },
      { "id": "8", "name": "Scikit-image", "type": "Library", "desc": "A library for Image Processing with Python." },
      { "id": "9", "name": "OpenCV", "type": "Library", "desc": "A library for Image Processing with Python." },
    ]
    // inserts skills
    skills.forEach((oneSkill) => {
      db.run("INSERT INTO skills (sid, sname, sdesc, stype) VALUES (?, ?, ?, ?)", [oneSkill.id, oneSkill.name, oneSkill.desc,
      oneSkill.type], (error) => {
        if (error) {
          console.log("ERROR: ", error)
        } else {
          console.log("Line added into the skills table!")
        }
      })
    })
  }
});

// creates table projectsSkills at startup
db.run("CREATE TABLE projectsSkills (psid INTEGER PRIMARY KEY, pid INTEGER, sid INTEGER, FOREIGN KEY (pid) REFERENCES projects (pid),FOREIGN KEY (sid) REFERENCES skills (sid))", (error) => {
  if (error) {
    // tests error: display error
    console.log("ERROR: ", error)
  } else {
    // tests error: no error, the table has been created
    console.log("---> Table projectsSkills created!")
    const projectsSkills = [
      { "id": "1", "pid": "1", "sid": "2" },
      { "id": "2", "pid": "1", "sid": "8" },
      { "id": "3", "pid": "1", "sid": "9" },
      { "id": "4", "pid": "2", "sid": "3" },
      { "id": "5", "pid": "2", "sid": "4" },
      { "id": "6", "pid": "3", "sid": "1" },
      { "id": "7", "pid": "4", "sid": "2" },
      { "id": "8", "pid": "4", "sid": "8" },
      { "id": "9", "pid": "4", "sid": "9" },
      { "id": "10", "pid": "5", "sid": "1" }
    ]
    // inserts projectsSkills
    projectsSkills.forEach((oneProjectSkill) => {
      db.run("INSERT INTO projectsSkills (psid, pid, sid) VALUES (?, ?, ?)", [oneProjectSkill.id, oneProjectSkill.pid,
      oneProjectSkill.sid], (error) => {
        if (error) {
          console.log("ERROR: ", error)
        } else {
          console.log("Line added into the projectsSkills table!")
        }
      });
    });
  }
});


// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');

// define static directory "public" to access css/ and img/
app.use(express.static('public'))

// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`)
});


app.get('/', function (request, response) {
  console.log("SESSION: ", request.session)
  const model = {
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('home.handlebars', model)
});

app.get('/home', function (request, response) {

  const model = {
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('home.handlebars', model)
});

app.get('/about', (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('about.handlebars', model)
});

//education starts here

app.get('/education', function (request, response) {
  db.all("SELECT * FROM education", function (error, theEducations) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        theError: error,
        education: [],
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      response.render('education.handlebars', model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        theError: "",
        education: theEducations,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      response.render("education.handlebars", model)
    }
  });
});

//deletes a education
app.get('/education/delete/:id', (req, res) => {
  const id = req.params.id
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run("DELETE FROM education WHERE eid=?", [id], function (error, theEducations) {
      if (error) {
        const model = {
          dbError: true, theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,

        }
        res.render('home.handlebars', model)
      }
      else {
        const model = {
          dbError: false, theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        }
        res.render('home.handlebars', model)
      }
    })
  } else {
    res.redirect('/login')
  }
});

app.get('/education/new', (req, res) => {
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    }
    res.render('neweducation.handlebars', model)
  } else {
    res.redirect('/login')
  }
});

app.post('/education/new', (req, res) => {
  const newp = [
    req.body.educname, req.body.educyear, req.body.educdesc, req.body.eductype, req.body.educimg,
  ]
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run("INSERT INTO education (ename, eyear, edesc, etype, eimgURL) VALUES (?, ?, ?, ?, ?)", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Line added into the education table!")
      }
      res.redirect('/education')
    })
  } else {
    res.redirect('/login')
  }
});

//sends the form to modify a project
app.get('/education/update/:id', (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM education WHERE eid=?", [id], function (error, theEducations) {
    if (error) {
      console.log("ERROR: ", error)
      const model = {
        dbError: true, theError: error,
        education: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("modifyeducation.handlebars", model)
    }
    else {
      //console.log("MODIFY: ", JSON.stringify(theEducation))
      //console.log("MODIFY: ", theEducation)
      const model = {
        dbError: false, theError: "",
        education: theEducations,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        helpers: {
          theTypeR(value) { return value == "Reserch"; },
          theTypeT(value) { return value == "Teaching"; },
          theTypeO(value) { return value == "Other"; }
        }
      }
      //renders the page with the model
      res.render("modifyeducation.handlebars", model)
    }
  })
});

app.post('/education/update/:id', (req, res) => {
  const id = req.params.id
  const newp = [
    req.body.educname, req.body.educyear, req.body.educdesc, req.body.eductype, req.body.educimg, id
  ]
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run("UPDATE education SET ename=?, eyear=?, edesc=?, etype=?, eimgURL=? WHERE eid=?", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Education updated!")
      }
      res.redirect('/education')
    })
  }
  else {
    res.redirect('/login')
  }
});

//project starts here

app.get('/projects', function (request, response) {
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        theError: error,
        projects: [],
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      response.render('projects.handlebars', model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        theError: "",
        projects: theProjects,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin
      }
      response.render("projects.handlebars", model)
    }
  });
});



//deletes a project
app.get('/projects/delete/:id', (req, res) => {
  const id = req.params.id
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run("DELETE FROM projects WHERE pid=?", [id], function (error, theProjects) {
      if (error) {
        const model = {
          dbError: true, theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,

        }
        res.render('home.handlebars', model)
      }
      else {
        const model = {
          dbError: false, theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        }
        res.render('home.handlebars', model)
      }
    })
  } else {
    res.redirect('/login')
  }
});

app.get('/projects/new', (req, res) => {
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    }
    res.render('newproject.handlebars', model)
  } else {
    res.redirect('/login')
  }
});

app.post('/projects/new', (req, res) => {
  const newp = [
    req.body.projname, req.body.projyear, req.body.projdesc, req.body.projtype, req.body.projimg,
  ]
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run("INSERT INTO projects (pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?)", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Line added into the projects table!")
      }
      res.redirect('/projects')
    })
  } else {
    res.redirect('/login')
  }
});

//sends the form to modify a project
app.get('/projects/update/:id', (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM projects WHERE pid=?", [id], function (error, theProject) {
    if (error) {
      console.log("ERROR: ", error)
      const model = {
        dbError: true, theError: error,
        project: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("modifyproject.handlebars", model)
    }
    else {
      //console.log("MODIFY: ", JSON.stringify(theProject))
      //console.log("MODIFY: ", theProject)
      const model = {
        dbError: false, theError: "",
        project: theProject,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        helpers: {
          theTypeR(value) { return value == "Reserch"; },
          theTypeT(value) { return value == "Teaching"; },
          theTypeO(value) { return value == "Other"; }
        }
      }
      //renders the page with the model
      res.render("modifyproject.handlebars", model)
    }
  })
});

app.post('/projects/update/:id', (req, res) => {
  const id = req.params.id
  const newp = [
    req.body.projname, req.body.projyear, req.body.projdesc, req.body.projtype, req.body.projimg, id
  ]
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run("UPDATE projects SET pname=?, pyear=?, pdesc=?, ptype=?, pimgURL=? WHERE pid=?", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Project updated!")
      }
      res.redirect('/projects')
    })
  }
  else {
    res.redirect('/login')
  }
});
app.get('/contact', function (request, response) {

  const model = {
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('contact.handlebars', model)
});

app.get('/login', function (request, response) {

  const model = {
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    isAdmin: request.session.isAdmin
  }
  response.render('login.handlebars', model)
});


app.post('/login', (req, res) => {
  const username = req.body.un;
  const password = req.body.pw;

  // Retrieve user from the database based on the username
  db.get("SELECT * FROM users WHERE username=?", [username], (error, user) => {
    if (error) {
      console.log("Database error: ", error);
      res.redirect('/login');
    } else if (!user) {
      // User not found
      console.log("User not found");
      req.session.isAdmin = false;
      req.session.isLoggedIn = false;
      req.session.name = "";
      res.redirect('/login');
    } else {
      // Compare the entered password with the hashed password from the database
      bcrypt.compare(password, user.password_hash, (bcryptError, result) => {
        if (bcryptError) {
          console.log("Bcrypt error: ", bcryptError);
          res.redirect('/login');
        } else if (result) {
          // Passwords match, login successful
          console.log("Login successful");
          req.session.isAdmin = user.role === 'admin'; // You may set other session variables as needed
          req.session.isLoggedIn = true;
          req.session.name = user.username;
          res.redirect('/');
        } else {
          // Passwords do not match
          console.log("Incorrect password");
          req.session.isAdmin = false;
          req.session.isLoggedIn = false;
          req.session.name = "";
          res.redirect('/login');
        }
      });
    }
  });
});


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    console.log("Error while destroying the session: ", err)
  })
  console.log('Logged out...')
  res.redirect('/')
})


