
import argparse

def main():
    parser = argparse.ArgumentParser(description='Template')
    parser.add_argument('input_docx', type=str)
    parser.add_argument('output_docx', type=str)
    args = parser.parse_args()
    print(args.input_docx)
    print(args.output_docx)
    func(args.input_docx, args.output_docx)

if __name__ == '__main__':
    main()
