<?php
require_once "Controller.php";
require_once "Repository/LocationRepository.php";

/**
 * Classe ExempleController
 * Gère les requêtes REST pour les produits.
 */
class LocationController extends Controller {

    private LocationRepository $location;

    public function __construct(){
        $this->location = new LocationRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId();

        if ($id){
            // URI est .../Location/{id}
            $p = $this->location->find($id);
            return $p == null ? false : $p;
        }
        else{
            // URI est .../Location
            return $this->location->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
    }

    protected function processPutRequest(HttpRequest $request) {
    }
}
?>