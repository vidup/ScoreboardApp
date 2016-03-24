var app = angular.module('soundboard', ['ionic']);

app.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});

app.controller('DutchCtrl', function ($scope, $ionicPopup) {

	$scope.selectedPlayer = 0;

		$scope.model = {
			showDelete: false,
			showMove: false,
			showForm : false,
			gameEnd : false,
			players : [
				{
					name : 'Victor',
					score : 0,
					add : 0,
					image : 'img/1.png',
					ranking : 1
				},
				{
					name : 'Etienne',
					score : 0,
					add : 0,
					image : 'img/1.png',
					ranking : 2
				},
				{
					name : 'Maëlle',
					score : 0,
					add : 0,
					image : 'img/1.png',
					ranking : 3
				},
				{
					name : 'Pauline',
					score : 0,
					add : 0,
					image : 'img/1.png',
					ranking : 4
				}
			]
		};

		var getWinners = function(players){
			index = 0;
			winners = [];
			for(i in players){
				if(players[i].score<players[index].score){
					index = i;
				}
			}
			winners.push(players[index]);
			for(i in players){
				if(players[i].score==winners[0].score){
					if(players[i].name!=winners[0].name){
						winners.push(players[i]);
					}
				}
			}
			return winners;
		}

		var getLosers = function(players){
			index = players.length-1;
			losers = [];
			for(i in players){
				if(players[i].score>players[index].score){
					index = i;
				}
			}
			losers.push(players[index]);
			for(i in players){
				if(players[i].score==losers[0].score){
					if(players[i].name!=losers[0].name){
						losers.push(players[i]);
					}
				}
			}
			console.log(losers);
			return losers;
		}

		var endGameTemplate = function(){
			//Winners
			var winners = getWinners($scope.model.players);
			var winnersPhrase = "";

			if(winners.length==1){
				winPhrase = "<h2>Winner :</h2> <strong>"+winners[0].name+'</strong>'
			}else{
				winPhrase = "<h2>Winners :</h2> "
				for(i in winners){
					if(i!=winners.length-1){
						winPhrase+= '<strong>'+winners[i].name+'</strong>, '
					}else{
						winPhrase+= "and <strong>"+ winners[i].name+'</strong>.';
					}
				}
			}
			winPhrase+="<p>Score : <strong>"+winners[0].score+'</strong></p>';

			//Losers
			var losers = getLosers($scope.model.players);
			var losePhrase = "";

			if(losers.length==1){
				losePhrase = "<h2>Loser :</h2> "+'<strong>'+losers[0].name+'</strong>'
			}else{
				losePhrase = "<h2>Losers :</h2> "
				for(i in losers){
					if(i!=winners.length-1){
						losePhrase+= '<strong>'+losers[i].name+'</strong>, '
					}else{
						losePhrase+= "and <strong>"+ losers[i].name+'</strong>.';
					}
				}
			}
			losePhrase+="<p>Score : <strong>"+losers[0].score+'</strong></p>';

			//Template
			var template = '<p>'+winPhrase+'</p>'+'<p>'+losePhrase+'</p>';
			return template
		}

		$scope.endGame = function() {

			var winPopup = $ionicPopup.alert({
				title: '<h2>The end !</h2>',
				template: endGameTemplate()
			});

			winPopup.then(function(res) {
				$scope.model.gameEnd = false;
				$scope.resetPoints();
			});
	  }

	var getImage = function(rank){
		return 'img/'+rank+'.png';
	}

	var rankPlayer = function(player, players){
		ranking = 1;
		for(i in players){
			if(player.score>players[i].score){
				ranking++;
			}
		}
		return ranking;
	}

	var rankPlayers = function(players){
		// We act on the $scope.players array if all scores have been modified
		$scope.model.updates=1;
		$scope.model.players.sort(function(a,b){
			return (a.ranking - b.ranking);
		});

		// We calculate the new rank of each player
		for(i in players){
			players[i].ranking = rankPlayer(players[i], players);
		}
		// Then we change their respective image according to their new ranks
		for(i in players){
			players[i].image = getImage(players[i].ranking);
		}
		if($scope.model.gameEnd){
			console.log('yo');
			$scope.endGame();
		}
	}

	$scope.deletePlayer = function(player){
		index = $scope.model.players.indexOf(player);
		$scope.model.players.splice(index, 1);
	}

	$scope.nextRound = function(){
		// rankPlayers($scope.model.players, index);
		$scope.clearAllForms();
		for(i in $scope.model.players){
			$scope.model.players[i].score+= $scope.model.players[i].add;
			if($scope.model.players[i].score == 100){
				$scope.model.players[i].score = 75;
			}
			if($scope.model.players[i].score>100){
				$scope.model.gameEnd = true;
			}
		}
		rankPlayers($scope.model.players);
	}

	$scope.resetPoints = function(type){
		for(i in $scope.model.players){
			$scope.model.players[i].score = 0;
		}
		rankPlayers($scope.model.players);
		if(type!="adding"){
			$scope.clearAllForms();
		}
	}

	$scope.selectPlayer = function($index){
		selectedPlayer=$index;
		$scope.model.showForm = true;
	}

	$scope.clearAllForms = function(){
		var forms = document.querySelectorAll('form');
		for(var i=0; i<=$scope.model.players.length-1;i++){
			forms[i].reset();
		}
	}

	/* Popup part, used to add players and to end the game */

	$scope.addPlayer = function(name){
		$scope.resetPoints("adding");
		var popup = $ionicPopup.prompt({
	    title: 'Enter the player\'s name',
			inputType: 'text',
 			inputPlaceholder: 'Example : Victor'
	  });
		popup.then(function(res){
			console.log(res);
			if(res){
				$scope.model.players.push({
					name : res,
					score : 0,
					add : 0,
					image : 'img/1.png',
					ranking : ($scope.model.players.length+1)
				});
			}
		});
	}


});
