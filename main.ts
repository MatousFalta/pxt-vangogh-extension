input.onButtonPressed(Button.A, () => {
    vanGogh.penDown();
    vanGogh.rectangle(100, 50);
})

input.onButtonPressed(Button.B, () => {
    vanGogh.fd(100);
})

input.onButtonPressed(Button.AB, function () {
    PCAmotor.MotorStopAll();
    basic.clearScreen();
})
