import { CustomScalar, Scalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

const MAX_INT = Number.MAX_SAFE_INTEGER
const MIN_INT = Number.MIN_SAFE_INTEGER

@Scalar('BigInt', (type) => BigInt)
export class BigIntScalar implements CustomScalar<BigInt, number> {
    description = 'Big Int Custom Scalar'

    parseValue(value: string): number {
        if (value === '') {
            throw new TypeError(
                'BigInt cannot represent non 53-bit signed integer value: (empty string)',
            )
        }
        const num = Number(value)
        if (num !== num || num > MAX_INT || num < MIN_INT) {
            throw new TypeError(
                'BigInt cannot represent non 53-bit signed integer value: ' +
                    String(value),
            )
        }
        const int = Math.floor(num)
        if (int !== num) {
            throw new TypeError(
                'BigInt cannot represent non-integer value: ' + String(value),
            )
        }
        return Number(value)
    }

    serialize(value: BigInt) {
        return BigInt(value.toString())
    }

    parseLiteral(ast: ValueNode) {
        if (ast.kind === Kind.INT) {
            const num = parseInt(ast.value, 10)
            if (num <= MAX_INT && num >= MIN_INT) {
                return num
            }
        }
        return null
    }
}
