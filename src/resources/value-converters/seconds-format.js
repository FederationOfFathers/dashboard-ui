export class SecondsFormatValueConverter {
    toView(value) {
        let time = parseInt(value);
        let totalSeconds = time / 1000;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds - (minutes * 60));
        let milliseconds = ((totalSeconds - seconds - (minutes * 60) + "0")).substring(2, 6); //adding "0" to make string for trimming

        return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2) + ":" +  milliseconds;
    }
}