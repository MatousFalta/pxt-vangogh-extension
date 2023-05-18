input.onButtonPressed(Button.A, () => {
    vanGogh.fdSpeed(10, true, 20)
})

input.onButtonPressed(Button.B, () => {
    vanGogh.fd(10)
})


input.onButtonPressed(Button.AB, function () {
    PCAmotor.MotorStopAll();
    basic.clearScreen();
})
