from pathlib import Path
import re


CARTELLA_PRINCIPALE = Path(r"C:\Users\miskat01\Downloads\success_book_img")


def numero_cartella(nome):
    match = re.search(r"(\d+)", nome)
    return int(match.group(1)) if match else 9999


def main():
    if not CARTELLA_PRINCIPALE.exists():
        raise FileNotFoundError(f"Cartella non trovata: {CARTELLA_PRINCIPALE}")

    cartelle = [
        cartella for cartella in CARTELLA_PRINCIPALE.iterdir()
        if cartella.is_dir()
    ]

    cartelle = sorted(cartelle, key=lambda c: (numero_cartella(c.name), c.name.lower()))

    print("LISTA CARTELLE:\n")

    for cartella in cartelle:
        print(cartella.name)

    print(f"\nTotale cartelle: {len(cartelle)}")


if __name__ == "__main__":
    main()