<?php
require_once "Controller.php";
require_once "Repository/VentesRepository.php";

/**
 * Classe ExempleController
 * Gère les requêtes REST pour les produits.
 */
class VentesController extends Controller {

    private VentesRepository $ventes;

    public function __construct(){
        $this->ventes = new VentesRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $param = $request->getParam("param");

        if  ($param == "top3"){
            return $this->ventes->mostUsed();
        }
        else if ($param == "lastmonth") {
            return $this->ventes->TotalLastmonth();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
    }

    protected function processPutRequest(HttpRequest $request) {
    }
}
?>