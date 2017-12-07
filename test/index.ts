import test from 'ava';
import { AllKeys, And, Bool, CombineObjects, DeepPartial, Diff, DiffKeys, False, If, Keys, Merge, Not, ObjectType, Omit, Or, SharedKeys, True, UnionizeObject, UnionizeTuple } from '../src/index';

function is<T, U extends T>(t: { pass: any }) { t.pass() }

// Conditionals

test('Can assign type conditionally', t => {
    type conditional<C extends Bool> = If<C, number, string>;
    type gotF = conditional<False>;
    type gotT = conditional<True>;

    is<gotF, string>(t);
    is<gotT, number>(t);
});

test('Conditions can be based on AND', t => {
    type conditional<C extends Bool, D extends Bool> = If<And<C, D>, number, string>;
    type gotFF = conditional<False, False>;
    type gotFT = conditional<False, True>;
    type gotTF = conditional<True, False>;
    type gotTT = conditional<True, True>;

    is<gotFF, string>(t);
    is<gotFT, string>(t);
    is<gotTF, string>(t);
    is<gotTT, number>(t);
});

test('Conditions can be based on OR', t => {
    type conditional<C extends Bool, D extends Bool> = If<Or<C, D>, number, string>;
    type gotFF = conditional<False, False>;
    type gotFT = conditional<False, True>;
    type gotTF = conditional<True, False>;
    type gotTT = conditional<True, True>;

    is<gotFF, string>(t);
    is<gotFT, number>(t);
    is<gotTF, number>(t);
    is<gotTT, number>(t);
});

test('Conditional logic can be inversed with NOT', t => {
    type conditional<C extends Bool> = If<Not<C>, number, string>;
    type gotF = conditional<False>;
    type gotT = conditional<True>;

    is<gotF, number>(t);
    is<gotT, string>(t);
});

// Objects

test('Can get keys from object', t => {
    type obj = { x: number, y: string, z: boolean };
    type expected = 'x' | 'y' | 'z';
    type got = Keys<obj>;

    is<expected, got>(t);
});

test('Can turn an object into another object', t => {
    type obj = { x: number, y: string };
    type expected = obj;
    type got = ObjectType<obj>;

    is<got, expected>(t);
});

test('Can combine two objects (without pesky & in vscode)', t => {
    type a = { x: number, y: 'hi' };
    type b = { z: number, y: 'there' };

    type got = CombineObjects<a, b>;
    type expected = {
        x: number,
        y: 'hi' & 'there',
        z: number
    };

    is<got, expected>(t);
});

test('Can get keys that are same between objects', t => {
    type a = { x: number, y: string };
    type b = { x: string, y: string, z: boolean };

    type got = SharedKeys<a, b>;
    type expected = 'x' | 'y';

    is<got, expected>(t);
});

test('Can get a union of all values in an object', t => {
    type a = { x: 'hi', y: 'there', z: 'friend' };

    type got = UnionizeObject<a>;
    type expected = 'hi' | 'there' | 'friend';

    is<got, expected>(t);
});

test('Can get all keys that are different between objects', t => {
    type a = { x: number, y: string };
    type b = { y: string, z: number };

    type gotA = DiffKeys<a, b>;
    type gotB = DiffKeys<b, a>;

    is<gotA, 'x'>(t);
    is<gotB, 'z'>(t);
});

test('Can get all keys between objects', t => {
    type a = { w: number, x: string };
    type b = { x: number, z: boolean };

    type got = AllKeys<a, b>;
    type expected = 'w' | 'x' | 'z';

    is<got, expected>(t);
});

test('Can omit keys from an object', t => {
    type a = { x: number, y: string, z: boolean };

    type got = Omit<a, 'x' | 'y'>;
    type expected = { z: boolean };

    is<got, expected>(t);
});

test('Can merge two objects, resolving matching keys by rightmost object', t => {
    type a = { x: number, y: string };
    type b = { y: number, z: string };

    type got = Merge<a, b>;
    type expected = { x: number, y: number, z: string };

    is<got, expected>(t);
});

test('Can get a deep partial object', t => {
    type a = {
        b: {
            c: number
        },
        d: string
    };

    type got = DeepPartial<a>;
    type expected = {
        b?: {
            c?: number
        },
        d?: string
    };

    is<got, expected>(t);
});

// Tuples

test('Can get a union of all values in tuple', t => {
    type t = ['hi', 'there', 'friend'];

    type got = UnionizeTuple<t>;
    type expected = 'hi' | 'there' | 'friend';

    is<got, expected>(t);
});

// Strings

test('Can get difference between unions of strings', t => {
    type a = 'hi' | 'there';
    type b = 'hi' | 'my' | 'friend';

    type gotA = Diff<a, b>;
    type gotB = Diff<b, a>;

    is<gotA, 'there'>(t);
    is<gotB, 'my' | 'friend'>(t);
});