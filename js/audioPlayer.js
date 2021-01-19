class AudioPlaylist{
    randomizeOrder(){
        for (var i = this.trackOrder.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.trackOrder[i];
            this.trackOrder[i] = this.trackOrder[j];
            this.trackOrder[j] = temp;
        }
        return this.trackOrder;
    }
    setTrack(arrayPos){
    
        var liPos = this.trackOrder[arrayPos]; // converting array index to html index
        this.player.src = $("#"+this.playlistId+ " li a").eq(liPos).attr("href");
        $("."+this.currentClass).removeClass(this.currentClass);
        $("#"+this.playlistId+ " li").eq(liPos).addClass(this.currentClass);
        this.trackPos = arrayPos; // update based on array index position
    }
    prevTrack(){
        if(this.trackPos == 0)
            this.setTrack(0);
        else
            this.setTrack(this.trackPos - 1);
        this.player.play();
    }
    nextTrack(){
        // if the track is not the last track in the track array, go to the next track
        if(this.trackPos < this.length - 1)
            this.setTrack(this.trackPos+1);
        else{
            if(this.shuffle)
                this.randomizeOrder();
            this.setTrack(0);
        }
        this.player.play();
            
    }
    setLoop(val){
        if(val === true)
            this.loop = true;
        else
            this.loop = false;
        return this.loop;
    }
    setShuffle(val){
        if(val == this.shuffle) // if nothing changes
            return val;
        else{
            if(val === true){
                this.randomizeOrder();
                this.shuffle = true;
            }
            else{
                this.shuffle = false;
                // empty path array, fill array with index sequentially
                this.trackOrder = [];
                for(var i = 0; i < this.length; i++){
                    this.trackOrder.push(i);
                }
                
                // jump array to track the current track position
                this.trackPos =  this.trackOrder.indexOf($("."+this.currentClass).index());
            }
            return this.shuffle;
        }
    }
    toggleShuffle(){
        if(this.shuffle === true)
            this.setShuffle(false);
        else
            this.setShuffle(true);
        return this.shuffle;
    }
    toggleLoop(){
        if(this.loop === true)
            this.setLoop(false);
        else
            this.setLoop(true);
        return this.loop;
    }
    constructor(config = {} ){
        
        /***
        *
        *       set defaults, and initialize the player 
        *
        */
        
        var classObj = this; // save scope for event listeners
        this.shuffle = (config.shuffle === true) ? true : false;
        this.playerId = (config.playerId) ? config.playerId : "audioPlayer";
        this.playlistId = (config.playlistId) ? config.playlistId : "playlist";
        this.currentClass = (config.currentClass) ? config.currentClass : "current-song"
        this.length = $("#"+this.playlistId+" li").length; 
        this.player = $("#"+this.playerId)[0];
        this.autoplay = (config.autoplay === true || this.player.autoplay) ? true : false;
        this.loop = (config.loop === true) ? true : false;
        this.trackPos = 0;
        this.trackOrder = [];
        for(var i = 0; i < this.length; i++){
            this.trackOrder.push(i);
        }
        
        if(this.shuffle)
            this.randomizeOrder();
        
        this.setTrack(this.trackPos);
        if(this.autoplay)
            this.player.play();
        
         /***
        *
        *       handle link clicks
        *
        */
        $("#"+this.playlistId+" li a ").click(function(e){
            e.preventDefault();
            // organize paths by index
            classObj.setTrack(classObj.trackOrder.indexOf($(this).parent().index()));
            classObj.player.play();
        });
        
         /***
        *
        *       handle the end of the track
        *
        */
        
        this.player.addEventListener("ended", function(){
            // jika trek terakhir berakhir
            if(classObj.trackPos < classObj.length - 1){
                classObj.setTrack(classObj.trackPos+1);
                classObj.player.play();
            }
            else{
                if(classObj.loop){
                    if(classObj.shuffle)
                        classObj.randomizeOrder();
                    classObj.setTrack(0);
                    classObj.player.play();
                }
            }
        });
        
    }
}

