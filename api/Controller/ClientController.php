<?php
require_once "Controller.php";
require_once "Repository/ClientRepository.php";

/**
 * Classe ExempleController
 * Gère les requêtes REST pour les produits.
 */
class ClientController extends Controller {

    private ClientRepository $client;

    public function __construct(){
        $this->client = new ClientRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $param = $request->getParam("param");

        if  ($param == "Stats"){
            $clientid = (int)$request->getParam("clientid");
            return $this->client->getStats($clientid);
        }
        else if ($param == "List") {
            return $this->client->getList();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
    }

    protected function processPutRequest(HttpRequest $request) {
    }
}
?>