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
        $id = $request->getId();

        if ($id){
            // URI est .../ventes/{id}
            $p = $this->ventes->find($id);
            return $p == null ? false : $p;
        }
        else{
            // URI est .../ventes
            return $this->ventes->TotalLastmonth();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
    }

    protected function processPutRequest(HttpRequest $request) {
    }
}
?>