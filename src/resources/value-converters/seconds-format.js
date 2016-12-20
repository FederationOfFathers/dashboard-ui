export class SecondsFormatValueConverter {
    toView(value) {
        let time = parseInt(value);
        let totalSeconds = time / 1000;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds - (minutes * 60));
        let milliseconds = totalSeconds.toString().split('.')[1] || "000";

        return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2) + ":" +  milliseconds;
    }
}