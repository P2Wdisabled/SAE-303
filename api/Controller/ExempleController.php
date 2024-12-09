<?php
require_once "Controller.php";
require_once "Repository/ExempleRepository.php";

/**
 * Classe ExempleController
 * Gère les requêtes REST pour les produits.
 */
class ExempleController extends Controller {

    private ExempleRepository $exemples;

    public function __construct(){
        $this->exemples = new ExempleRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId();

        if ($id){
            // URI est .../exemples/{id}
            $p = $this->exemples->find($id);
            return $p == null ? false : $p;
        }
        else{
            // URI est .../exemples
            return $this->exemples->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
    }

    protected function processPutRequest(HttpRequest $request) {
    }
}
?>