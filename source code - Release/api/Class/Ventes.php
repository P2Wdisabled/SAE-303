<?php
/**
 * Classe Exemple
 * Représente un produit avec les propriétés id, name, description, price, image_url.
 */
class Vente implements JsonSerializable {
    private int $id; // ID du produit
    private string $name; // Nom du produit

    public function __construct(int $id){
        $this->id = $id;
    }

    public function getId(): int {
        return $this->id;
    }
    /**
     * Définition de la manière dont un produit est converti en JSON.
     */
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id
        ];
    }
}
?>