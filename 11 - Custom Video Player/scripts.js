// Get Elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreenButton = player.querySelector('.fullscreen');
const wideScreenButton = player.querySelector('.widescreen');
const r = document.querySelector(':root');

// build functions
//toggle between .play() and .pause()
function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

//use spcae bar to toggle play 
function spaceControl(e) {
    if (e.keyCode === 32) {
        togglePlay();
    }
}

//update the button depending on the button
function updateButton() {
    //if video is paused, this is video since 
    //the only one that is calling the function is 
    //video element. 
    const icon = this.paused? '►' : '❚❚';
    toggle.textContent = icon;
}

//skip xx s 
function skip(){
    video.currentTime += parseFloat(this.dataset.skip);
}

//handle changes in the range slider
function handleRangeUpdate(e) {
    //if mouseUp and not clicking 
    //= mousemove without mouse down return
    if (e.type != 'click' && !isDown) {
        return;
    }
    video[this.name] = this.value;
    console.log(this.name);   
}


//progress bar length is updated to video time in real time
function handleProgress() {
    const percent = video.currentTime/video.duration * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

//scrub the progressBar and adjust the video time
function scrub(e) {
    const scrubTime = e.offsetX/progress.offsetWidth * video.duration;
    video.currentTime = scrubTime;
}

//toggle between fullscreen and normal
function toggleFullscreen() {
    if (player.fullscreenElement){
        player.exitFullscreen();
    } else {
        player.requestFullscreen();
    }
}

// //toggle between wide screen(all browser) and normal
//does not work because player has max-width
function toggleWidescreen(){
    r.style.setProperty('--width', `${window.innerWidth}px`);
    r.style.setProperty('--height', `${window.innerHeight}px`);
    player.classList.toggle('wideScreen');
}



// hook up event listener
//space bar to control, through window 
window.addEventListener('keydown', spaceControl);

//click the video we can play and pause
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);


//click the toggle button we can play and pause
toggle.addEventListener('click', togglePlay);


//click skip button will skip time
skipButtons.forEach(skipButton =>skipButton.addEventListener('click', skip));

//update range when clicked and moved
let isDown = false;
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));
//be thorough, so method still called if volume or play rate is updated without mouse
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('click', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousedown', ()=> isDown = true));
ranges.forEach(range => range.addEventListener('mouseup', ()=> isDown = false));

//update progress bar according to the video time
video.addEventListener('timeupdate', handleProgress);

//click on progress bar to adjust the video time
//work on progress as it represents the full length
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);


//toggle between full screen and normal
fullScreenButton.addEventListener('click', toggleFullscreen);

//toggle between wide screen and normal
wideScreenButton.addEventListener('click',toggleWidescreen);



