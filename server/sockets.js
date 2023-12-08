function sockets(io, socket, data) {
  socket.emit("init", data.getUILabels());

  socket.on("pageLoaded", function (lang) {
    socket.emit("init", data.getUILabels(lang));
  });

  socket.on("switchLanguage", function (lang) {
    socket.emit("init", data.getUILabels(lang));
  });

  socket.on("createPoll", function (d) {
    socket.emit("pollCreated", data.createPoll(d.pollId, d.lang), d.message);
  });

  socket.on("addQuestion", function (d) {
    data.addQuestion(d.pollId, d.q); //, a: d.a}
    socket.emit("dataUpdate", data.getAnswers(d.pollId));
    io.to(d.pollId).emit("newQuestion", data.getQuestion(d.pollId));
  });

  socket.on("editQuestion", function (d) {
    data.editQuestion(d.pollId, d.index, { q: d.q }); //, a: d.a}
    socket.emit("questionEdited", data.getAllQuestions(d.pollId));
  });

  socket.on("joinPoll", function (pollId) {
    socket.join("" + pollId);
    socket.emit("newQuestion", data.getQuestion(pollId));
    socket.emit("dataUpdate", data.getAnswers(pollId));
  });

  socket.on("joinDate", function (userData) {
    socket.join("" + userData.pollId);
    io.to(userData.pollId).emit("joinedDate", userData.userInfo);
    io.to(userData.pollId).emit(
      "addedPlayer",
      data.addPlayer(userData.pollId, userData.userInfo)
    ); //
  });

  socket.on("runQuestion", function (d) {
    io.to(d.pollId).emit(
      "newQuestion",
      data.getQuestion(d.pollId, d.questionNumber)
    );
    io.to(d.pollId).emit("dataUpdate", data.getAnswers(d.pollId));
  });

  socket.on("submitAnswer", function (d) {
    io.to(d.pollId).emit(
      "incomingAnswers", data.storeAnswer(d.pollId, d.userInfo.answer, d.userInfo.uniquePlayerId)
    );
  });

  socket.on("resetAll", () => {
    data = new Data();
    data.initializeData();
  });

  socket.on("removePlayer", function (d) {
    //lagt till
    socket.join("" + d.pollId);
    io.to(d.pollId).emit(
      "removedPlayer",
      data.removeUserInfo(d.pollId, d.userInfo)
    ); 
  });

  socket.on("eliminatedPlayer", function (id){  
  io.to(id.pollId).emit("hejKomOKyssMig", data.eliminateAPlayer(id.pollId, id.uniquePlayerId))// tar endast bort en spelare 
  })

  socket.on("getEliminatedPlayer", function(pollId){
    socket.join("" + pollId);
    io.to(pollId).emit("hejKomOKyssMig", data.retrieveEliminatedPlayer(pollId))
   })

  

  



}


export { sockets };
