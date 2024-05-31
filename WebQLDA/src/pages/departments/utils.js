
export function parseWeekDay(weekDayName){
    switch(weekDayName) {
        case 'SUNDAY':
          return 'Chủ nhật';
        case 'MONDAY':
            return 'Thứ 2';
        case 'TUESDAY':
            return 'Thứ 3';
        case 'WEDNESDAY':
            return 'Thứ 4';
        case 'THURSDAY':
            return 'Thứ 5';
        case 'FRIDAY':
            return 'Thứ 6';
        case 'SATURDAY':
            return 'Thứ 7';
        default:
          return '';
    }
}

export function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " giờ, " : " giờ, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " phút, " : " phút, ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " giây" : " giây") : "";
    return hDisplay + mDisplay + sDisplay; 
}
