{ pkgs ? import <nixpkgs> { } }:
with pkgs;
mkShell {
  nativeBuildInputs = with nodePackages; [ nodejs npm pnpm ];
}
