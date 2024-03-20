class AppController {
    garageNavigateSubscriptions: Array<() => void> = [];

    winnersNavigateSubscriptions: Array<() => void> = [];

   onGarageNavigate(subscribtion: () => void) {
    this.garageNavigateSubscriptions.push(subscribtion);
   }

   onWinnersNavigate(subscribtion: () => void) {
    this.winnersNavigateSubscriptions.push(subscribtion);
   }

   handleGarageNavigate() {
    this.garageNavigateSubscriptions.forEach((subscribtion) => subscribtion());
   }

   handleWinnersNavigate() {
    this.winnersNavigateSubscriptions.forEach((subscribtion) => subscribtion());
   }
}

export default new AppController()
