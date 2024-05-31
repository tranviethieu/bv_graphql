

export const dateToTick = (myDate)=>{
    var epochTicks = 621355968000000000;

    // there are 10000 .net ticks per millisecond
    var ticksPerMillisecond = 10000;
    // calculate the total number of .net ticks for your date
    return epochTicks + (myDate.getTime() * ticksPerMillisecond);
}