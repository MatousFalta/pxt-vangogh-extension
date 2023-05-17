input.onButtonPressed(Button.A, () => {
    vanGogh.circle(50);
})

input.onButtonPressed(Button.B, () => {
    vanGogh.fd(100);
})

input.onButtonPressed(Button.AB, function () {
    PCAmotor.MotorStopAll();
    basic.clearScreen();
})
