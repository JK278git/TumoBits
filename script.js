window.onload = async function() {


    // Carregar o service worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js");
    }


    //carregar dados da internet (data.json)
    let request = await fetch("data.json");
    let audioData = await request.json();

    // Variáveis de elementos

    let title = document.querySelector("#title");
    let previousButton = document.querySelector("#previous-button");
    let playButton = document.querySelector("#play-button");
    let nextButton = document.querySelector("#next-button");
    
    let scrubInput = document.querySelector("#scrub-input");
    let volumeInput = document.querySelector("#volume-input");

    let fileInput = document.querySelector("#file-input");

    let audio = document.querySelector("audio");
    let currentMusic = 0;
    let pauseTime = 0;






    // Funções

    function changeTitle(value) {
        title.innerText = value;
    }

    function updateInputBar(value, bar) {
        bar.style.transform = "scaleX(" + value / 100 + ")";
    }


    previousButton.onclick = function() {
        
        currentMusic--;
        if(currentMusic < 0) {
            currentMusic = audioData.length-1;
        }
        playAudio();
    }

    playButton.onclick = function() {
        
        if(audio.paused) {
            playAudio();
            audio.currentTime = pauseTime;
            pauseTime = 0
        } else {
            pauseTime = audio.currentTime;
            pauseAudio();
        }
    }

    nextButton.onclick = function() {
        currentMusic++;
        if(currentMusic >= audioData.length) {
            currentMusic = 0;
        }
        playAudio();
    }

    scrubInput.querySelector("input").oninput = function(event) {
        let bar = scrubInput.querySelector(".range-bar");
        let scrubValue = scrubInput.querySelector("input").value
        scrubAudio(scrubValue);
        updateInputBar(event.target.value, bar)
    }

    volumeInput.querySelector("input").oninput = function(event) {
        let bar = volumeInput.querySelector(".range-bar");

        let volumeValue = volumeInput.querySelector("input").value  / 100;
        audio.volume = volumeValue;
        updateInputBar(event.target.value, bar)
    }

    fileInput.oninput = function() {
        
        let file = Array.from(fileInput.files)[0];
        let reader = new FileReader();
        reader.onload = function() {
            audioData.push({
                title: file.name,
                url: reader.result
            })
        }
        if(file) {
            reader.readAsDataURL(file);
        }

    }

    function playAudio() {

        audio.src = audioData[currentMusic].url;
        changeTitle(audioData[currentMusic].title)
        audio.play();
    }
    function pauseAudio() {
        audio.pause();
    }

    function scrubAudio(value) {

        if(!audio.src) {
            return;
        }
        audio.currentTime = audio.duration * (value/100)
    }

    audio.onplay = function (){
        let playIcon = document.querySelector("#icon-play")
        let pauseIcon = document.querySelector("#icon-pause")
        playIcon.style.display = "none";
        pauseIcon.style.display = "initial";
    }

    audio.onpause = function() {
        let playIcon = document.querySelector("#icon-play")
        let pauseIcon = document.querySelector("#icon-pause")
        playIcon.style.display = "initial";
        pauseIcon.style.display = "none";
    }

    audio.ontimeupdate = function() {
        let bar = scrubInput.querySelector(".range-bar");
        let value = (audio.currentTime / audio.duration) * 100;
        updateInputBar(value, bar);
    }

    audio.onended = function() {
        nextButton.click()
    }

        
}