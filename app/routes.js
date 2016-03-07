var express= require('express');
module.exports=function(app,passport,Project,User,Task){
             app.post('/api/project-task', isLoggedIn, function(req, res){
                   var newTask = new Task(req.body);
                        newTask.save(function(err, saved)
                        {
                            if(err)
                                res.status(500).send(err);
                            else
                                 res.json(saved);
                        });
                    });

             app.get('/api/get-taskp', isLoggedIn, function(req,res){
                  Task.find({pId: req.query.id}).exec(function(err, tasks){
             res.json(tasks);
            });
             });

            app.get('/api/get-task', isLoggedIn, function(req,res){
               Task.find({ $and: [ { pId: req.query.id }, { uId: req.query.uid } ] }).exec(function(err,tasks){
                  res.json(tasks);
               });
            });
             app.delete('/api/delete-task', isLoggedIn, function(req,res){
                Task.remove({_id:req.query.id}).exec(function(err,task){
                    if(err)
                        res.send(err);
                    else
                        res.json(task);
                });
             });

             app.delete('/api/delete-project', isLoggedIn, function(req,res){
              Project.remove({_id:req.query.id},function(err,proj){
                if(err)
                  res.send(err);
                else
                  res.json(proj);
              })
             })

            app.get('/api/usersList', isLoggedIn, function(req, res) {
                  User.find({}, function(err, users) {
                    var userMap = {};
                    users.forEach(function(user) {
                      userMap[user._id,user.local.username] = user._id;
                    });

                    res.send(userMap);
                  });
        });

    app.post('/api/create-project', isLoggedIn, function(req, res){
        var newProject = new Project(req.body);
        newProject.save();
        res.json(newProject);
        });
        // app.get('/api/get-my-project', function(req, res){
        //         Project.find({userId: req.query.id }).exec(function(err, projects){
        //      res.json(projects);
        //     });
        // });

//working for owner and collaborator
        app.get('/api/get-my-project1', isLoggedIn,function(req, res){
          User.findById(req.query.id).exec(function(err, user){
                 if(err || !user){
                     return res.status(404).end();
                 }

                Project.find({"$or": [{"projectcollaborators": {'$in': [user]}} ,{"userId": req.query.id }]}).exec(function(err, projects){
             res.json(projects);
            });
        });
        });

        app.put('/api/collab-update', isLoggedIn, function(req,res){
          return Project.findById(req.query.id,function(err,result){
            if(err){
                res.send(err);
            }
            result.projectcollaborators = req.body.projectcollaborators;
            return result.save(function(err){
                  if(err)
                    res.send(err);
                  else
                  res.json(result);
                });
          });
        });
        //add collaborators to the project
        app.put('/api/collab-update1',isLoggedIn, function(req,res){
          var projcoll = req.body.projectcollaborators;
          Project.update({ _id: req.query.id },
                 { $addToSet: { projectcollaborators: { $each: projcoll } } }
                 ,function(err,res1){

                  if(err){
                    res.send(err);
                  }
                  else
                    res.json(res1);
                 })
        });
        //delete collaborators from the project list
        app.put('/api/collab-delete',isLoggedIn,function(req,res){
          var delcoll = req.body.projectcollaborators;
              Project.update({_id:req.query.id},
                { $pullAll: { projectcollaborators: delcoll } },function(err,res2){
                  if(err){
                    res.send(err);
                  }
                  else
                    res.json(res2);
                })
        });

        app.put('/api/task-update', isLoggedIn, function(req,res){
           return Task.findById(req.query.id,function(err, result){
                if(err ){
                    res.send(err);
                }
                result.taskName = req.body.taskName;
                result.description = req.body.description;
                result.toTime = req.body.toTime;
                result.fromTime = req.body.fromTime;
                 return result.save(function(err){
                  if(err)
                    res.send(err);
                  else
                  res.json(result);
                });
            });
        });
        app.get('/api/get-assigned-projects',isLoggedIn, function(req, res){
             User.findById(req.query.id).exec(function(err, user){
                 if(err || !user){
                     return res.status(404).end();
                 }

                 Project.find({projectcollaborators: {'$in': [user]}}).populate('userId').exec(function(err, projects){
                     res.json({myproject: projects});
                 });

             });

            });
        app.get('/api/get-projcollab',isLoggedIn,function(req,res){
        Project.findById(req.query.id).exec(function(err,project){

          if(err)
            return res.ststus(404).end();
          else
            return res.json(project);
        });
});


 app.get('/api/get-time',isLoggedIn,function(req,res){
                  Task.find({pId: req.query.id}).exec(function(err, tasks){
             res.json(tasks);
            });
             });

	app.get('/',function(req,res){

  res.render('login.jade',{message:req.flash('login Message')});


	});

	app.get('/login', function(req,res){
		res.render('login.jade',{message:req.flash('login Message')});
	});

	 // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.jade', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);


        app.post('/signup',passport.authenticate('local-signup',{
            successRedirect:'/profile',
            failureRedirect:'/signup',
            failureflash :true
        }));
// process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.jade', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
