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
        "id": "1", "name": "Calcus", "type": "course", "desc": "Mathematics is the branch of mathematics that focuses on the study of change and accumulation, developed independently by Newton and Leibniz in the 17th century, including differential calculus, which looks for the number of changes of instantaneous occurrence, and the integral calculus of accumulation of numbers.", "year": 2023, "url": "/img/math.jpg"
      },
      {
        "id": "2", "name": "Object progamming", "type": "course", "desc": "Object-oriented programming is a way of writing code that groups related data and functions into objects, making it easier to manage and reuse code for building complex systems..", "year": 2023, "url": "/img/code-from-pixabay.jpg"
      },
      {
        "id": "3", "name": "Web Development Basics", "type": "course", "desc": "Hands-on workshop teaching the basics of web development using HTML, CSS, and JavaScript.", "year": 2023, "url": "/img/database.jpg"
      },
      {
        "id": "4", "name": "Database", "type": "course", "desc": "Study of database and sql and how to create tables and their diffrent use purpose", "year": 2023, "url": "/img/web.jpg"
      },
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
        "id": "1", "name": "Tictactoe", "type": "Programming", "desc": "The purpose of this project is to learn how to code in java and how to use the mvc-model to follow the oop-princples and make the tictactoe game",
        "year": 2023, "url": "/img/tictactoe.jpg"
      },
      {
        "id": "2", "name": "Encryption project", "type": "Programming", "desc": "The project takes in a text and depending on the encryption-key it changes exampel abc with the encrypt key 4 to lin and with the decrypt button switches back to abc. It is useful for doctors to view in 3D their patients and the evolution of a disease.", "year":
          2023, "url": "/img/encryptionengine.jpg"
      },
      { "id": "3", "name": "Worm game", "type": "Programming", "desc": "When we started with the object-oriented course i created a worm-game where every time it eats a pixel it should grow with a pixel and set borders for it very fun", "year": 2023, "url": "/img/worm.jpg" },
      {
        "id": "4", "name": "Web development", "desc": "Creating a full functional website with a database and server-side javascript. We combine all of this in order to create a responsive and modern website platform", "year": 2023, "type": "Project",
        "url": "/img/Web-site.png"
      }
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

// creates table education_projects at startup
db.run("CREATE TABLE IF NOT EXISTS education_projects (id INTEGER PRIMARY KEY, education_id INTEGER, project_id INTEGER, FOREIGN KEY (education_id) REFERENCES education (eid), FOREIGN KEY (project_id) REFERENCES projects (pid))", (error) => {
  if (error) {
    console.log("ERROR: ", error);
  } else {
    console.log("---> Table education_projects created!");
    const educationProjectsData = [
      { "id": 1, "education_id": 2, "project_id": 1 },
      { "id": 2, "education_id": 2, "project_id": 2 },
      { "id": 3, "education_id": 3, "project_id": 4 },
      { "id": 4, "education_id": 4, "project_id": 4 },


    ];

    // inserts education_projects data
    educationProjectsData.forEach((association) => {
      db.run("INSERT INTO education_projects (id, education_id, project_id) VALUES (?, ?, ?)", [association.id, association.education_id, association.project_id], (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Line added into the education_projects table!");
        }
      });
    });
  }
});
// creates table skills at startup
db.run("CREATE TABLE IF NOT EXISTS skills (id INTEGER PRIMARY KEY, skill_name TEXT)", (error) => {
  if (error) {
    console.log("ERROR: ", error);
  } else {
    console.log("---> Table skills created!");
    const skillsData = [
      { "id": 1, "skill_name": "Java" },
      { "id": 2, "skill_name": "Object-Oriented Programming" },
      { "id": 3, "skill_name": "HTML" },
      { "id": 4, "skill_name": "CSS" },
      { "id":5 , "skill_name": "Javascript"},
      
    ];

    // inserts skills data
    skillsData.forEach((skill) => {
      db.run("INSERT INTO skills (id, skill_name) VALUES (?, ?)", [skill.id, skill.skill_name], (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Line added into the skills table!");
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

app.get('/skills', (req, res) => {
  db.all("SELECT * FROM skills", (error, skillsData) => {
    if (error) {
      const model = {
        hasDatabaseError: true,
        theError: error,
        skillsData: [],
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      };
      res.render('skills.handlebars', model);
    } else {
      const model = {
        hasDatabaseError: false,
        theError: "",
        skillsData: skillsData,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      };
      res.render('skills.handlebars', model);
    }
  });
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




  app.get('/educationdetail/:id', (req, res) => {
    const id = req.params.id
    db.get("SELECT * FROM education WHERE eid=?", [id], function (error, theEducations) {
        if (error) {
            console.log("ERROR: ", error)
            const model = {
                dbError: true,
                theError: error,
                education: [],
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin
            }
            // renders the page with the model
            res.render("educationdetail", model)
        }
        else {
            console.log("Education DETAILS")
            const model = {
                dbError: false,
                theError: "",
                education: theEducations,
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin
            }
            // renders the page with the model
            res.render("educationdetail", model)
        }
    })
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
          theTypeR(value) { return value == "Course"; },
          theTypeT(value) { return value == "Labs"; },
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

app.get('/projectsdetail/:id', (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM projects WHERE pid=?", [id], function (error, theProject) {
      if (error) {
          console.log("ERROR: ", error)
          const model = {
              dbError: true,
              theError: error,
              project: [],
              isLoggedIn: req.session.isLoggedIn,
              name: req.session.name,
              isAdmin: req.session.isAdmin
          }
          // renders the page with the model
          res.render("projectsdetail", model)
      }
      else {
          console.log("PROJECT DETAILS")
          const model = {
              dbError: false,
              theError: "",
              project: theProject,
              isLoggedIn: req.session.isLoggedIn,
              name: req.session.name,
              isAdmin: req.session.isAdmin
          }
          // renders the page with the model
          res.render("projectsdetail", model)
      }
  })
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
          theTypeR(value) { return value == "Programming"; },
          theTypeT(value) { return value == "Project"; },
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
});

// List all users
app.get('/users', function (req, res) {
  db.all("SELECT * FROM users", function (error, theUsers) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        users: [],
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      };
      res.render('users.handlebars', model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        users: theUsers,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      };
      res.render('users.handlebars', model);
    }
  });
});

// Delete a user
app.get('/users/delete/:id', (req, res) => {
  const id = req.params.id;
  if (req.session.isLoggedIn && req.session.isAdmin) {
    db.run("DELETE FROM users WHERE id=?", [id], function (error) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render('home.handlebars', model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render('home.handlebars', model);
      }
    });
  } else {
    res.redirect('/login');
  }
});

// Render the form for creating a new user
app.get('/users/new', (req, res) => {
  if (req.session.isLoggedIn && req.session.isAdmin) {
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    };
    res.render('newuser.handlebars', model);
  } else {
    res.redirect('/login');
  }
});





app.post('/users/new', (req, res) => {
  const { username, password, isAdmin } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password

  const newUser = [username, hashedPassword, isAdmin];

  if (req.session.isLoggedIn && req.session.isAdmin) {
    db.run("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", newUser, (error) => {
      if (error) {
        console.log("ERROR: ", error);
        res.status(500).send("Internal Server Error"); // or render an error page
      } else {
        console.log("User added to the users table!");
        res.redirect('/users'); // Redirect to the appropriate page (e.g., /users)
      }
    });
  } else {
    res.redirect('/login');
  }
});



// Render the form for updating a user
app.get('/users/update/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM users WHERE id=?', [id], function (error, theUser) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        user: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };
      res.render('updateuser.handlebars', model);
    } else {
      const model = {
        dbError: false,
        theError: '',
        user: theUser,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        helpers: {
          theTypeA(value) { return value == "admin"; },
          theTypeU(value) { return value == "user"; },
        }
      };
      res.render('updateuser.handlebars', model);
    }
  });
});

// Update a user
app.post('/users/update/:id', (req, res) => {
  const id = req.params.id;
  const { username, password, isAdmin } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (req.session.isLoggedIn && req.session.isAdmin) {
    db.run(
      'UPDATE users SET username=?, password_hash=?, role=? WHERE id=?',
      [username, hashedPassword, isAdmin, id],
      (error) => {
        if (error) {
          console.log('ERROR: ', error);
        } else {
          console.log('User updated!');
        }
        res.redirect('/home');
      }
    );
  } else {
    res.redirect('/login');
  }
});
